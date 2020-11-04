<template>
    <div class="outter clearfix">
        <div class="imgCheckBox">
            <div>
                <file-input multiple accept='image/*' :uploader="uploader">
                    <span class="icon ion-upload">選擇圖片</span>
                </file-input>
                <div class="sendBtn" @click="sendImg">上傳</div>
            </div>
            <img v-if="url" :src="url" alt="" />
        </div>
        <div class="controlBox">
            <table v-if="orderList.length > 0">
            <thead>
                <tr>
                    <th><div class="sortBtn" @click="saveOrder">排序儲存</div></th>
                    <th>圖片</th>
                    <th>上傳時間</th>
                    <th>刪除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in orderList" :key="item.stamp">
                    <td>
                        <i v-if="index !== 0"
                           :data-index="item.seq"
                           class="fas fa-angle-double-up"
                           @click="sortUp(index, item.seq )">
                        </i>
                        <i v-if="index !== orderList.length - 1"
                           :data-index="item.seq"
                           class="fas fa-angle-double-down"
                           @click="sortDown(index, item.seq )">
                        </i>
                    </td>
                    <td><img :src="item.url" alt=""></td>
                    <td>{{item.time}}</td>
                    <td><i class="fas fa-trash-alt" @click="deleteItem(item.id,item.name)"></i></td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import FineUploaderTraditional from "fine-uploader-wrappers";
import FileInput from 'vue-fineuploader/file-input';
import Firebase from 'firebase';
import { mapGetters, mapActions } from "vuex";

export default {
    name: "control",
    components: {
        FileInput,
    },
    data() {
        return {
            file:'',
            url: '',
            orderList: [],
            imgInput: '',
            uploader: new FineUploaderTraditional({
                options: {
                    autoUpload: false,
                    // request: {
                    //     endpoint: "http://localhost:8000/uploads",
                    // },
                    validation: {
                        allowedExtensions: ['jpeg', 'jpg', 'gif', 'png']
                    },
                },
            }),
        };
    },
    computed: {
        ...mapGetters(['imageSort']),
        controlImgList: function() {
            let controlImgList = [];
            controlImgList = this.imageSort.map((item, index )=> {
                return { seq: index+1 , ...item } ;
            });
            return controlImgList.sort(function (a, b) {
                return a.seq > b.seq ? 1 : -1 ;
            });
        }
    },
    created() {
        this.getIdList();
        this.orderList = JSON.parse(JSON.stringify(this.controlImgList));
    },
    watch: {
        controlImgList: function(newValue, oldValue) {
            this.orderList = newValue ;
        },
    },
    mounted() {
        this.imgInput = document.querySelector('.vue-fine-uploader-file-input input');
        this.imgInput.addEventListener('change',this.addInputListener);
    },
    beforeRouteLeave(to, from, next) {
        this.imgInput.removeEventListener('change', this.addInputListener);
        next();
    },
    methods: {
        ...mapActions(['getIdList','addImageList','updateImageList','deleteImageList']),
        addInputListener(e) {
            const file = e.srcElement.files[0];
            const imgURL = window.URL.createObjectURL(file);
            this.url = imgURL;
            this.file = e.target.files[0];
        },
        sortUp(index, seq) {
            let focusIndex = index ;
            let changeSeq = seq ;
            changeSeq -- ;
            let change = {...this.orderList[focusIndex], seq: changeSeq };
            this.orderList.splice(focusIndex, 1, change);
            focusIndex -- ;
            changeSeq ++ ;
            let change2 = {...this.orderList[focusIndex],seq:changeSeq };
            this.orderList.splice(focusIndex, 1, change2);
            this.orderList.sort(function (a, b) {
                return a.seq > b.seq ? 1 : -1 ;
            });
        },
        sortDown(index, seq ) {
            let focusIndex = index ;
            let changeSeq = seq ;
            changeSeq ++ ;
            let change = {...this.orderList[focusIndex],seq:changeSeq };
            this.orderList.splice(focusIndex, 1, change);
            focusIndex ++ ;
            changeSeq -- ;
            let change2 = {...this.orderList[focusIndex],seq:changeSeq };
            this.orderList.splice(focusIndex, 1, change2);
            this.orderList.sort(function (a, b) {
                return a.seq > b.seq ? 1 : -1 ;
            });
        },
        saveOrder() {
            let setList = [];
            this.imageSort.forEach( outItem => {
                let index = this.orderList.findIndex(inItem => inItem.id === outItem.id);
                if( outItem.order !== this.orderList[index].seq ) {
                    let setItem = { id: outItem.id ,
                                    order: this.orderList[index].seq };
                    setList.push(setItem);
                }
            });
            // console.log("setList",setList)
            this.updateImageList(setList);
        },
        sendImg() {
            if(this.file === '') {
                return
            }
            const storageRef = Firebase.storage().ref(`photo/${this.file.name}`);
            const task = storageRef.put(this.file);
            task.on( "state_changed", snapshot => {}, err => console.log(err),
                ()=> {
                    storageRef.getDownloadURL()
                    .then( url => {
                        let creatTime = new Date();
                        let imgData = {
                            name: this.file.name,
                            stamp: Math.floor(Date.now()) ,
                            url: url,
                            order: 0,
                            time: creatTime.toLocaleString()
                        };
                        this.addImageList(imgData);
                    })
                    .then(() => {
                        this.saveOrder();
                        this.file = '';
                        this.url = '';
                        alert("上傳成功");
                    });
                }
            )
        },
        deleteItem(id,name) {
            this.deleteImageList(id)
            .then(()=> {
                let storageRef = Firebase.storage().ref();
                let desertRef = storageRef.child(`photo/${name}`);
                desertRef.delete();
            })
            .then(()=> this.saveOrder());
        },
    },
};
</script>

<style scoped>

img {
    width: 50%;
}

i {
    margin: 5px;
    font-size: 1.5rem;
    cursor: pointer;
}

i:hover {
    color: #E57CA7 ;
}

table,tr, th {
  border-collapse: collapse;
  background-color: #323C50;
}

th {
    padding: 7px;
    background-color: #2C3446;
}

tr img {
    width: 50%;
}

td {
    padding: 10px 0;
    width: 280px;
    text-align: center;
}

tr>td:first-of-type {
    width: 50px;
}

tr>td:nth-last-of-type(2) {
    width: 220px;
}

tr>td:last-of-type {
    width: 80px;
}

.vue-fine-uploader-file-input,
.sendBtn,
.sortBtn {
    display: inline-block;
    margin-left: 10px;
    padding: 5px 0;
    line-height: 30px;
    border-radius: 5px;
    background-color: #77BD83;
    font-weight: 600;
    color: #2C3446;
    width: 80px;
    height: 30px;
    cursor: pointer;
}

.vue-fine-uploader-file-input:hover,
.sendBtn:hover,
.sortBtn:hover {
    background-color: antiquewhite;
}

.imgCheckBox {
    padding: 10px;
    margin-bottom: 20px;
    float: left;
    text-align: center;
    width: 40%;
    border: 3px solid #77BD83;
}
.imgCheckBox>div {
    margin-bottom: 20px;
}

.controlBox {
    float: left;
    width: 55%;
    margin-left: 20px;
}

</style>
