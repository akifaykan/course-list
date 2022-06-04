
class Course {
    constructor(title, image){
        this.id = Math.floor(Math.random() * 10000)
        this.title = title
        this.image = image
    }
}

class UI {
    addCourse(course){
        const courseHtml = `
            <tr>
                <td>${course.image}</td>
                <td>${course.title}</td>
                <td><a href="#" data-id="${course.id}" class="remove-link">Del</a></td>
            </tr>
        `
        const courseList = document.getElementById('course-list')
        
        courseList.innerHTML += courseHtml
    }
    
    clearForm(){
        document.querySelector('[name="title"]').value = ""
        document.querySelector('[name="image"]').value = ""
    }

    removeItem(e){
        if (e.classList.contains('remove-link')){
            e.parentElement.parentElement.remove()
            
            this.message('Kurs silindi', 'danger')
        }
    }
    
    message(message, classes = "default"){
        const alert = document.querySelector('.alert-message')
        
        const alertHtml = `
            <div class="alert ${classes}">${message}</div>
        `
        
        alert.insertAdjacentHTML('afterbegin', alertHtml)
        
        setTimeout(() => {
            const timeAlert = document.querySelector('.alert')
            timeAlert.remove()
        }, 1200)
    }
}

class Storage {
    static getStorage(){
        let courses
        
        if( localStorage.getItem('courses') === null ){
            courses = []
        } else {
            courses = JSON.parse( localStorage.getItem('courses') )
        }
        
        return courses
    }

    static displayStorage(){
        const courses = Storage.getStorage()
        
        courses.forEach(course => {
            const ui = new UI()
            
            ui.addCourse(course)
        })
    }

    static addStorage(e){
        const courses = Storage.getStorage()
        
        courses.push(e)
        localStorage.setItem('courses', JSON.stringify(courses))
    }

    static removeStorage(e){
        if (e.classList.contains('remove-link')){
            const id = e.getAttribute('data-id')
            const courses = Storage.getStorage()
            
            courses.forEach((course, index) => {
                if (course.id == id){
                    courses.splice(index, 1)
                }
            })
            
            localStorage.setItem('courses', JSON.stringify(courses))
        }
    }
}

class Action {
    constructor(){
        const form = document.getElementById('course-form')
        const list = document.getElementById('course-list')
        
        document.addEventListener('DOMContentLoaded', Storage.displayStorage)
        
        form.addEventListener('submit', this.submitForm)
        list.addEventListener('click', this.removeCourse)
    }
    
    submitForm(e){
        const title = document.querySelector('[name="title"]').value
        const image = document.querySelector('[name="image"]').value
        
        const course = new Course(title, image)
        const ui = new UI()
        
        if (title === '' || image === ''){
            ui.message('Lütfen alanları boş bırakmayınız!', 'warning')
        } else {
            ui.addCourse(course)
            ui.clearForm()
            ui.message('Kurs başarı ile eklendi!', 'success')
            
            Storage.addStorage(course)
        }

        e.preventDefault()
    }
    
    removeCourse(e){
        const ui = new UI()
        
        ui.removeItem(e.target)
        
        Storage.removeStorage(e.target)
        
        e.preventDefault()
    }
}

new Action()