<template >
    <div class="bg-primary text-white min-h-screen">
        <NavBar />
        <SideBar />
        <div class="p-4 sm:ml-64 ">
            <div class="p-4 mt-14">
                <!--main content start-->
                <router-view></router-view>
                <!--main content end-->
            </div>
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

<style scoped></style>
