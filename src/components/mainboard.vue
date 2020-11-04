<template>
    <div class="container">
        <header>
            <div class="link"><router-link to="/">觀看輪播</router-link></div>
            <div class="link"><router-link to="/control">管理輪播圖</router-link></div>
        </header>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>

<style scoped>

.container {
    margin: 0 auto;
    width: 80%;
}

header {
    margin: 30px 0;
    padding-bottom: 20px;
    border-bottom:3px solid #77BD83;
}

.link {
    margin:10px ;
    padding: 10px;
    display: inline-block;
    border-radius: 5px;
    text-align: center;
    width: 100px;
    background-color: #435359;
}

.link:hover {
    background-color: #77BD83;
}

.link:hover a {
    color: #435359 ;
}

.link a {
    font-weight: 600;
    color: white;
    text-decoration: none;

}

</style>
