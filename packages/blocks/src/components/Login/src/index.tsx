import { loginEmits, loginProps } from './types'
import LoginForm from './components/LoginForm'
import './styles/login.css'

export default defineComponent({
    name: 'LoginPage',
    props: loginProps,
    emits: loginEmits,
    setup(props, { emit, slots }) {
        const { layout, bg, bgImageUrl, imagePosition, ...loginFormProps } = props

        const isRightImage = computed(() => imagePosition === 'right')

        return () => {
            if (slots.default) {
                if (layout === 'column') {
                    return (
                        <div class={[
                            'container',
                            'column',
                        ]}>
                            <div class='column-item' style={{
                                order: isRightImage.value ? 1 : 2,
                            }}>
                                {isRightImage.value && <div class='logo'>
                                    {slots.logo?.()}
                                </div>}
                                <LoginForm {...loginFormProps} shadow={false}
                                    radius={false}
                                    onFinish={(values) => emit('finish', values)}
                                >
                                    {slots.default()}
                                </LoginForm>
                            </div>
                            <div class='column-muted' style={{
                                order: isRightImage.value ? 2 : 1,
                            }}>
                                {!isRightImage.value && <div class='logo'>
                                    {slots.logo?.()}
                                </div>}
                                {props.bgImageUrl && (
                                    <img
                                        src={props.bgImageUrl}
                                        alt="Image"
                                        class='column-muted-image'
                                    />
                                )}
                            </div>
                        </div>
                    )
                }
                if (layout === 'card') {
                    return (
                        <div class={['container', 'flex-center', 'card-login-wrapper']}
                            style={{
                                backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'transparent',
                            }}
                        >
                            <div class='logo'>
                                {slots.logo?.()}
                            </div>
                            <div class="card-img-cover"></div>
                            <div class="card"
                                style={{
                                    flexDirection: isRightImage.value ? 'row' : 'row-reverse',
                                }}
                            >
                                <div class={['card-column-item', 'flex-1']}
                                >
                                    <LoginForm {...loginFormProps} shadow={false}
                                        radius={false}
                                        onFinish={(values) => emit('finish', values)}
                                    >
                                        {slots.default()}
                                    </LoginForm>
                                </div>
                                <div class={['card-column-muted', 'flex-1']}
                                    style={{
                                        width: '350px',
                                    }}
                                >
                                    {bgImageUrl && (
                                        <img
                                            src={bgImageUrl}
                                            alt="Image"
                                            class='column-muted-image'
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }
                return (
                    <div class={['container', 'flex-center']}
                        style={{
                            backgroundImage: `url(${bgImageUrl})`,
                            backgroundSize: 'cover',
                        }}
                    >
                        <div class={['flex-col', 'space-y-4']}>
                            {slots.logo?.()}
                            <LoginForm {...loginFormProps} onFinish={(values) => emit('finish', values)}>
                                {slots.default()}
                            </LoginForm>
                        </div>
                    </div>
                )
            } else {
                if (layout === 'column') {
                    return (
                        <div class={[
                            'container',
                            'column',
                            { 'column-reverse': props.imagePosition === 'left' }
                        ]}>
                            <div class='column-item'>
                                {isRightImage.value && <div class='logo'>
                                    {slots.logo?.()}
                                </div>}
                                <LoginForm {...loginFormProps} shadow={false}
                                    radius={false}
                                    onFinish={(values) => emit('finish', values)}
                                />
                            </div>
                            <div class='column-muted'>
                                {!isRightImage.value && <div class='logo'>
                                    {slots.logo?.()}
                                </div>}
                                {props.bgImageUrl && (
                                    <img
                                        src={props.bgImageUrl}
                                        alt="Image"
                                        class='column-muted-image'
                                    />
                                )}
                            </div>
                        </div>
                    )
                }
                if (layout === 'card') {
                    return (
                        <div class={['container', 'flex-center']}>
                            <div class='logo'>
                                {slots.logo?.()}
                            </div>
                            <div class="card">
                                <div class={['card-column-item', 'flex-1']}>
                                    <LoginForm {...loginFormProps} shadow={false}
                                        radius={false}
                                        onFinish={(values) => emit('finish', values)}
                                    />
                                </div>
                                <div class={['card-column-muted', 'flex-1']}
                                    style={{
                                        width: '350px'
                                    }}
                                >
                                    {bgImageUrl && (
                                        <img
                                            src={bgImageUrl}
                                            alt="Image"
                                            class='column-muted-image'
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }
                return (
                    <div class={['container', 'flex-center']}
                        style={{
                            backgroundImage: `url(${bgImageUrl})`,
                            backgroundSize: 'cover',
                        }}
                    >
                        <div class={['flex-col', 'space-y-4']}>
                            {slots.logo?.()}
                            <LoginForm {...loginFormProps} />
                        </div>
                    </div>
                )
            }
        }
    }
})
