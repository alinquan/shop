<template>
    <div>
        <van-nav-bar title="商品类型"></van-nav-bar>
        <div class="category">
            <van-row>
                <van-col span="6" class="nav">
                    <ul>
                        <li
                                @click="selectCategory(item.typeId, index)"
                                :class="{active:active==index}"
                                v-for="(item, index) in types"
                                :key="index"
                        >{{item.typeName}}
                        </li>
                    </ul>
                </van-col>
                <van-col span="18" class="container">
                    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                        <van-list class="content" @load="onLoad" v-model="isLoading" :finished="finished"
                                  finished-text="没有更多了" :offset="100">
                            <div @click="goDetail(item._id)" class="content-item"
                                 v-for="(item, index) in productList" :key="index">
                                <img :src="item.img" alt>
                                <p class="content-item-name">{{item.name}}</p>
                                <p>￥{{item.price}}</p>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                types: [], // 类型信息
                active: 0,
                productList: [],
                typeId: 1, // 当前选中类型的id
                finished: false, //是否数据取完
                isLoading: false,// 上拉加载
                page: {
                    page: 1,
                    page_size: 10,
                    num_pages: 1,
                }
            };
        },
        created() {
            this.$get(this.$API.productType).then((res) => {
                console.log(res, 111);
                this.types = res;
                this.selectCategory(this.typeId, this.active);
            });
        },
        methods: {
            selectCategory(typeId, index) {
                this.active = index;
                this.typeId = typeId;
                this.productList = [];
                this.getProductList(1);
            },
            getProductList(flag) {
                this.isLoading = true;
                if (flag) {
                    this.finished = false;
                    this.page.page = 1;
                    this.page.num_pages = 1;
                } else {
                    this.page.page++;
                }
                if (this.page.page > this.page.num_pages) {
                    this.page.page = this.page.num_pages;
                    return
                }
                this.$get(this.$API.getProductsByType, {
                    typeId: this.typeId,
                    page: this.page.page,
                    page_size: this.page.page_size
                }).then((res) => {
                    let list = res.data || [];
                    this.page.num_pages = res.num_pages;
                    if (list.length > 0) {
                        this.productList = this.productList.concat(res.data);
                    }
                    if (res.num_pages === this.page.page) {
                        this.finished = true;
                    }
                    this.isLoading = false;
                });
            },
            onLoad() {
                this.getProductList();
            },
            onRefresh() {
                this.productList = [];
                this.getProductList(1);
            },
            goDetail(id) {
                // console.log(id);
                /* this.$router.push({
                  name: 'detail',
                  params: {
                    id: id
                  }
                }); */

                /* this.$router.push({
                  path: '/detail',
                  query: {
                    id: id
                  }
                }); */

                this.$router.push(`/detail/${id}`);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .nav {
        background-color: #eee;

        li {
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #fff;
            padding: 3px;
            text-align: center;
        }

        .active {
            background: #ffffff;
        }
    }

    .container {
        position: fixed;
        top: 50px;
        bottom: 55px;
        right: 0;
        overflow-y: scroll;
    }

    .content {
        display: flex;
        padding: 20px 10px;
        flex-wrap: wrap;

        &-item {
            width: 50%;
            box-sizing: border-box;
            padding: 0 5px;
            text-align: center;

            img {
                width: 120px;
                height: 120px;
            }

            &-name {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
</style>

