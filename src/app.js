import './styles.css'
import { createModal, isValid } from './utils'
import { Question } from './question'
import { authWithEmailAndPassword, getAuthForm } from './auth'


const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = document.getElementById('question-input')
const submitBtn = document.getElementById('submit')

// console.log(form, input, submitBtn);
window.addEventListener('load', Question.renderList)

modalBtn.addEventListener('click', openModal)
form.addEventListener('submit', submitFormHandler)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()
    console.log(input.value);
    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtn.disabled = true

        Question.create(question).then(() => {

            input.value = ''
            input.className = ''
            submitBtn.disabled = false

        })

        console.log(question);

    }
}

function authFormHandler(event) {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true
    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)

}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка!', content)
    } else {
        createModal('Список вопросов', Question.listToHTML(content))
    }
    // console.log(content);

}

function openModal() {
    createModal('Авторизация', getAuthForm())
    document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true })
}