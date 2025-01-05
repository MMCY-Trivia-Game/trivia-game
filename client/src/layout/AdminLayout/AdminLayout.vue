<template>
    <NavBar />
    <SideBar />
    <div class="p-4 sm:ml-64">
        <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <!--main content start-->
            <router-view></router-view>
            <!--main content end-->
        </div>
    </div>
</template>



<script setup>
import SideBar from '@/layout/AdminLayout/common/SideBar.vue'
import NavBar from '@/layout/AdminLayout/common/NavBar.vue'
import { onMounted } from 'vue';
import { initFlowbite } from 'flowbite'


onMounted(() => {
    initFlowbite();
})

</script>
