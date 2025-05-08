import styles from './styles/index.module.css'
import { loginEmits, loginProps } from './types'
import { NImage } from 'naive-ui'
import LoginForm from './components/LoginForm'
// import { RouterLink } from 'vue-router'

export default defineComponent({
    name: 'LoginPage',
    props: loginProps,
    emits: loginEmits,
    setup(props, { emit }) {
        const { layout, ...loginFormProps } = props
        
        
        return () =>  {
            if (layout === 'column') {
                return (
                    <div class={[styles.container, styles.column]}>
                        <div class={styles['column-item']}>
                        <LoginForm {...loginFormProps} shadow={false} />
                        </div>
                        <div class={styles['column-muted']}>
                            <NImage
                                src={props.bgImage}
                                alt="Image"
                                class={styles['column-muted-image']}
                            />
                        </div>
                    </div>
                )
            }

            return (
                <div class={styles.container}>
                    <LoginForm {...loginFormProps} />
                </div>
            )
        }
    }
})
