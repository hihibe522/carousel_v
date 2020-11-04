import Vue from 'vue';
import Vuex from 'vuex';
import { db } from "./db";
import { vuexfireMutations } from 'vuexfire';
// import Firebase from 'firebase'
// import firebase from 'firebase/app'
import 'firebase/firestore';
const fStore = db.firestore();

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        idList: [],
    },
    actions: {
        getIdList({ commit }) {
            return fStore.collection('images')
            .get()
            .then(querySnapshot => {
                const imageDoc = querySnapshot.docs.map( doc => {
                    return { ...doc.data(),
                             id: doc.id
                           }
                });
               commit('SET_IMAGE_DATA', imageDoc);
            });
        },
        addImageList({ dispatch }, imageListObj) {
            fStore.collection('images')
            .add({ ...imageListObj })
            .then(() => {
                return dispatch('getIdList');
            });
        },
        async updateImageList({ dispatch }, imageListObj) {
            await Promise.all( imageListObj.map(item => updateToDB(item)))
            .then(()=> {
                return dispatch('getIdList');
            });

            function updateToDB(item) {
                const { id, order } = item;
                fStore.collection('images')
                .doc(id)
                .update({ order: order });
            }
        },
        deleteImageList({ dispatch }, id) {
              fStore.collection('images')
              .doc(id).delete()
              .then(() => {
                  return dispatch('getIdList');
              });
        }
    },
    mutations: {
        SET_IMAGE_DATA: function(state, data) {
            state.idList = data ;
        },
        ...vuexfireMutations
    },
    getters: {
        imageSort: state => {
            return state.idList.sort(function(a, b) {
                return a.order > b.order ? 1 : -1 ;
            });
        },
    },
    modules: {
    }
})
