// Todo List App

class Course {
    constructor(title, image){
        this.courseId = Math.floor(Math.random()*10000)
        this.title = title
        this.image = image
    }
}

class UI {
    addCourse(course){
        const courseList = document.getElementById('course-list')

        const listHtml = `
            <tr>
                <td><img src="./img/${course.image}" alt="${course.title}"></td>
                <td>${course.title}</td>
                <td><a href="#" data-id="${course.courseId}" class="remove-link">Sil</a></td>
            </tr>
        `

        courseList.innerHTML += listHtml
    }

    clearCourse(){
        const image = document.querySelector('[name="image"]').value = ""
        const title = document.querySelector('[name="title"]').value = ""
    }

    deleteCourse(e){
        if(e.classList.contains('remove-link')){
            e.parentElement.parentElement.remove()

            const ui = new UI()
            this.messages('Kurs başarıyla silindi!', 'danger')
        }
    }
    
    messages(message, classes='default'){
        const alert = `
            <div class="alert ${classes}">${message}</div>
        `
        
        const messages = document.querySelector('.alert-message')
        messages.insertAdjacentHTML('afterbegin', alert)
        
        setTimeout( () => {
            const alert = document.querySelector('.alert')
            alert.remove()
        }, 1200)
    }
}

class Storege {
    static getCourses(){
        let courses
        
        if( localStorage.getItem('courses') === null ){
            courses = []
        } else {
            courses = JSON.parse( localStorage.getItem('courses') )
        }
        
        return courses
    }
    
    static displayCourses(){
        const courses = this.getCourses()
        
        courses.forEach(course => {
            const ui = new UI()
            ui.addCourse(course)
        })
    }
    
    static addCourse(course){
        const courses = this.getCourses()
        
        courses.push(course)
        localStorage.setItem('courses', JSON.stringify(courses))
    }
    
    static deleteCourse(e){
        if(e.classList.contains('remove-link')){
            const id = e.getAttribute('data-id')
            const courses = this.getCourses()
            
            courses.forEach((course, index) => {
                if(course.courseId == id){
                    courses.splice(index, 1)
                }
            })
            
            localStorage.setItem('courses', JSON.stringify(courses))
        }
    }
}

class Actions {
    constructor(){
        const courseForm = document.getElementById('course-form')
        const courseList = document.getElementById('course-list')
        
        document.addEventListener('DOMContentLoaded', Storege.displayCourses())

        courseForm.addEventListener( 'submit', this.submitForm )
        courseList.addEventListener( 'click', this.deleteItem )
    }

    submitForm(e){
        const title = document.querySelector('[name="title"]').value
        const image = document.querySelector('[name="image"]').value

        const course = new Course( title, image )
        const ui = new UI()
        
        if( title === '' || image === '' ){
            ui.messages('Lütfen alanları boş bırakmayınız!', 'warning')
        } else {
            //Add, Clear, Message
            ui.addCourse(course)
            ui.clearCourse()
            ui.messages('Kurs başarıyla eklendi!', 'success')

            // Save item LocalStorage
            Storege.addCourse(course)
        }

        e.preventDefault()
    }

    deleteItem(e){
        const ui = new UI()

        ui.deleteCourse(e.target)

        // Delete item LocalStorage
        Storege.deleteCourse(e.target)
        
        e.preventDefault()
    }
}

new Actions()