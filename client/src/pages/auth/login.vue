<template>
    <div class="w-full bg-secondary flex flex-col md:flex-row items-center justify-center h-screen">
        <div class="flex flex-col md:flex-row w-11/12 bg-white md:w-3/5 shadow-xl  p-20 rounded-2xl">
            <!--Vector animation start-->
            <div class="hidden md:block md:w-1/2">
                <img :src="loginSVG" alt="Login SVG" />
            </div>
            <!--Vector animation end-->

            <!--logo start-->
            <div class="block md:hidden md:w-1/2">
                <img :src="logo" alt="logo" />
            </div>
            <!--logo end-->

            <div class="md:w-1/2 text-white">
                <div>
                    <h2 class="text-2xl font-semibold text-center mb-6">Login</h2>

                    <!-- Login Form -->
                    <form>
                        <div class="mb-4">


                            <!-- Email Input -->
                            <fwb-input type="email" label="Email" placeholder="Enter your Email" size="lg" />



                            <!-- Password Input -->
                            <fwb-input type="password" label="Password" placeholder="Enter your Password" size="lg" />


                        </div>

                        <div class="flex justify-between items-center mb-4">
                            <div>
                                <input type="checkbox" id="remember" name="remember"
                                    class="h-4 w-4 text-indigo-700 border-primary rounded" />
                                <label for="remember" class="text-sm text-primary ps-2">Remember me</label>
                            </div>
                            <a href="#" class="text-sm text-primary ">Forgot password?</a>
                        </div>
                        <router-link :to="{ name: 'adminLayout' }">
                            <fwb-button class="w-full bg-primary hover:bg-secondary hover:text-white  text-white"
                                color="alternative" type="submit" size="lg">
                                <span>Login</span>
                                <div class="flex justify-center"><fwb-spinner size="6" /></div>
                            </fwb-button>
                        </router-link>



                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import loginSVG from '@/assets/Secure-login.svg'
import logo from '@/assets/logo-highlight.png'
import { FwbInput, FwbButton } from 'flowbite-vue'
</script>