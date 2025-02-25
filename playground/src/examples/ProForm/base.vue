<script setup lang="ts">
import { NDatePicker, NForm, NFormItem, NInput, NButton } from 'naive-ui';
import { ref } from 'vue'

const username = ref<string | null>(null)
const gender = ref<string | null>(null)
const password = ref<string | null>(null)
const age = ref<number | null>(null)
const birthday = ref<number | null>(null)

const login = () => {
    console.log(username.value, password.value)
}


</script>

<template>
    <n-card class="w-600px">
        <n-form>
            <n-form-item label="用户名">
                <n-input v-model:value="username" placeholder="用户名" />
            </n-form-item>
            <n-form-item label="性别">
                <n-select v-model:value="gender" placeholder="性别"
                    :options="[
                        {
                            label: '男',
                            value: '男'
                        },
                        {
                            label: '女',
                            value: '女'
                        }
                    ]"
                />
            </n-form-item>
            <n-form-item label="年龄">
                <n-input-number v-model:value="age" class="w-100%" :min="0" :max="100" placeholder="年龄" />
            </n-form-item>
            <n-form-item label="生日">
                <n-date-picker v-model:value="birthday" class="w-100%" type="date" placeholder="生日" />
            </n-form-item>
            <n-form-item label="密码">
                <n-input v-model="password" type="password" placeholder="密码" />
            </n-form-item>
            <n-form-item>
                <n-button type="primary" class="w-100%" @click="login">登录</n-button>
            </n-form-item>
        </n-form>
    </n-card>
</template>
