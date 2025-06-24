import '../styles/login.css'
import { NButton, NCheckbox, NForm, NFormItem, NInput, type FormInst } from 'naive-ui'
import { loginFormProps } from '../types'

export default defineComponent({
    name: "LoginForm",
    props: loginFormProps,
    emits: loginEmits,
    setup(props, { emit, slots }) {
        const { actions, title, subTitle, signUpUrl, forgotUrl, shadow, radius } = props

        const formData = reactive({
            username: '',
            password: ''
        })

        const remember = ref(false)

        const rules = {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
            ]
        }

        const formRef = ref<FormInst | null>(null)

        const handleLogin = () => {
            formRef.value?.validate((errors) => {
                if (!errors) {
                    emit('finish', toRaw(formData))
                } else {
                    console.error(errors)
                    emit('error', errors)
                }
            })
        }

        const handleLoginWithWeChat = () => {
            console.error('Weixin login is not supported yet.')
            emit('wechatFinish')
        }
        // console.log({ slot: slots.default })

        return () => (
            <div
                class={[
                    'login-form',
                    {
                        ['login-form-shadow']: shadow,
                    },
                ]}
                style={[
                    {
                        borderRadius: radius ? `${radius}px` : 'none',
                    }
                ]}
            >
                <div class='title'>
                    { title }
                </div>
                <div class='sub-title'>
                    { subTitle }
                </div>

                { slots.default ? slots.default() : (
                <NForm ref={formRef} model={formData} rules={rules} size="large"
                    show-require-mark={false}
                >
                    <NFormItem label="用户名" path="username">
                        <NInput v-model:value={formData.username} placeholder={`请输入用户名`} />
                    </NFormItem>
                    <NFormItem label="密码" path="password">
                        <NInput v-model:value={formData.password} placeholder={`请输入密码`} type="password" />
                    </NFormItem>

                    <div class="password-forgot">
                        <NCheckbox v-model:checked={remember.value} label='记住密码' />
                        {forgotUrl && <a href={forgotUrl}>忘记密码？</a>}
                    </div>

                    <NFormItem showLabel={false}>
                        <NButton attr-type="button" type="primary" block onClick={() => handleLogin()}>登录</NButton>
                    </NFormItem>
                    {actions && <NFormItem showLabel={false}>
                        <NButton color="#02E16E" ghost block onClick={() => handleLoginWithWeChat()}>微信登录</NButton>
                    </NFormItem>}
                </NForm>)}
                {signUpUrl && <div class="signUp">
                    还没有账号？
                    <a href={signUpUrl as string}>立即注册</a>
                </div>}
            </div>
        )
    }
})