import styles from '../styles/index.module.css'
import { NButton, NCard, NCheckbox, NForm, NFormItem, NInput, type FormInst } from 'naive-ui'
import { loginFormProps } from '../types'

const CardTitle = defineComponent({
    name: 'CardTitle',
    props: {
        title: {
            type: String,
            default: 'Welcome back',
        },
        description: {
            type: String,
            default: 'Login to your account',
        },
    },
    setup(props) {
        const { title, description } = props
        return () => (
            <div>
                <div class={styles.title}>{title}</div>
                <div class={styles.description}>{description}</div>
            </div>
        )
    }

})

export default defineComponent({
    name: "LoginForm",
    props: loginFormProps,
    emits: loginEmits,
    setup(props, { emit }) {
        const { actions, title, subTitle, signUpUrl, forgotUrl, shadow } = props

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

        return () => (
            <NCard
            title={() => <CardTitle title={title} description={subTitle} />}
            style={[{
                    width: '350px',
                },
                shadow && "box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);"
            ]}
            bordered={false}
            hoverable={shadow}
        >
            <NForm ref={formRef} model={formData} rules={rules} size="large"
                show-require-mark={false}
            >
                <NFormItem label="用户名" path="username">
                    <NInput v-model:value={formData.username} placeholder={`请输入用户名`} />
                </NFormItem>
                <NFormItem label="密码" path="password">
                    <NInput v-model:value={formData.password} placeholder={`请输入密码`} type="password" />
                </NFormItem>

                <div class={styles['password-forgot']}>
                    <NCheckbox v-model:checked={remember.value} label='记住密码' />
                    {forgotUrl && <a href={forgotUrl}>忘记密码？</a>}
                </div>

                <NFormItem showLabel={false}>
                    <NButton attr-type="button" type="primary" block onClick={() => handleLogin()}>登录</NButton>
                </NFormItem>
                {actions && <NFormItem showLabel={false}>
                    <NButton color="#02E16E" ghost block onClick={() => handleLoginWithWeChat()}>微信登录</NButton>
                </NFormItem>}
            </NForm>
            {signUpUrl && <div class={styles.signUp}>
                还没有账号？
                <a href={signUpUrl as string}>立即注册</a>
            </div>}
        </NCard>
        )
    }
})