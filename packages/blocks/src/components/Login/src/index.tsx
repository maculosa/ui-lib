import styles from './styles/index.module.css'
import { loginEmits, loginProps } from './types'
import { NImage } from 'naive-ui'
import LoginForm from './components/LoginForm'
// import { RouterLink } from 'vue-router'

export default defineComponent({
    name: 'LoginPage',
    props: loginProps,
    emits: loginEmits,
    setup(props, { emit, slots }) {
        const { layout, bg, bgImage, logo, ...loginFormProps } = props
        
        // const LogoComponent = () => logo
        
        return () =>  {
            if (layout === 'column') {
                return (
                    <div class={[styles.container, styles.column]}>
                        <div class={styles['column-item']}>
                            <div class={styles['logo']}>
                                {slots.logo?.()}
                            </div>
                            <LoginForm {...loginFormProps} shadow={false}
                                onFinish={(values) => emit('finish', values)}
                            />
                        </div>
                        <div class={styles['column-muted']}>
                            {props.bgImage && (
                                <NImage
                                    src={props.bgImage}
                                    alt="Image"
                                    class={styles['column-muted-image']}
                                />
                            )}
                        </div>
                    </div>
                )
            }

            if (layout === 'card') {
                return (
                    <div class={[styles.container, styles['flex-center']]}>
                        <div class={[styles['card']]}>
                            <div class={[styles['column-item'], styles['flex-1']]}>
                                <LoginForm {...loginFormProps} shadow={false}
                                    onFinish={(values) => emit('finish', values)}
                                />
                            </div>
                            <div class={[styles['column-muted'], styles['flex-1']]}
                                style={{

                                }}
                            >
                                {props.bgImage && (
                                    <NImage
                                        src={props.bgImage}
                                        alt="Image"
                                        class={styles['column-muted-image']}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            return (
                <div class={[styles.container, styles['flex-center']]}>
                    <div class={[styles['flex-col'], styles['space-y-4']]}>
                        {slots.logo?.()}
                        <LoginForm {...loginFormProps} />
                    </div>
                </div>
            )
        }
    }
})
