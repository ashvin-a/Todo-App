/*
			KEY COMPONENTS:
			"activeItem" = null until an edit button is clicked. Will contain object of item we are editing
			"list_snapshot" = Will contain previous state of list. Used for removing extra rows on list update

			PROCESS:
			1 - Fetch Data and build rows "buildList()"
			2 - Create Item on form submit
			3 - Edit Item click - Prefill form and change submit URL
			4 - Delete Item - Send item id to delete URL
			5 - Cross out completed task - Event handle updated item

			NOTES:
			-- Add event handlers to "edit", "delete", "title"
			-- Render with strike through items completed
			-- Remove extra data on re-render
			-- CSRF Token
		*/

const form = document.getElementById('form-wrapper')
let activeItem = null

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function buildList(){
    const element = document.getElementById('list-wrapper')
    element.innerHTML = ''
    const url = 'http://127.0.0.1:8000/api/task-list/'
    fetch(url)
    .then((response)=>response.json())
    .then(function(data){

        let list = data
        for(let i in list){

           const row = document.createElement('div')
           row.id=`data-row-${i}`
           row.classList.add('task-wrapper','flex-wrapper')

           const titlediv = document.createElement('div')
           titlediv.style.flex = 7
           const span1 = document.createElement('span')
           span1.classList.add('title')
           if (list[i].completed){
            span1.style.textDecoration = 'line-through'
           }
           span1.textContent = `${list[i].title}`
           titlediv.appendChild(span1)

           const buttondiv = document.createElement('div')
           buttondiv.style.flex = 1
           const btn = document.createElement('button')
           btn.classList.add('btn','btn-sm','btn-outline-info','edit')
           btn.textContent = 'Edit'
           buttondiv.appendChild(btn)

           const deletediv = document.createElement('div')
           deletediv.style.flex = 1
           const del = document.createElement('button')
           del.classList.add('btn','btn-sm','btn-outline-dark','delete')
           del.textContent = '-'
           deletediv.appendChild(del)

           row.appendChild(titlediv)
           row.appendChild(buttondiv)
           row.appendChild(deletediv)
           element.appendChild(row)

           let editBtn = document.getElementsByClassName('edit')[i]
           editBtn.addEventListener('click',function(){
                activeItem = list[i]
                document.getElementById('title').value = activeItem.title
            })

            let deleteBtn = document.getElementsByClassName('delete')[i]
            deleteBtn.addEventListener('click',function(){
                let url = `http://127.0.0.1:8000/api/task-delete/${list[i].id}`
                fetch(url,{
                    method: 'DELETE',
                    headers: {
                        'Content-type':'application/json',
                        'X-CSRFToken':csrftoken,
                    }
                }).then(function(response){
                    buildList()
                })
            })

            let strikeBtn = document.getElementsByClassName('title')[i]
            strikeBtn.addEventListener('click',function(){
                console.log('click')
                let url = `http://127.0.0.1:8000/api/task-update/${list[i].id}`
                fetch(url,{
                    method: 'PATCH',
                    headers: {
                        'Content-type':'application/json',
                        'X-CSRFToken':csrftoken,
                    },
                    body: JSON.stringify({'title':list[i].title,
                                            'completed':!list[i].completed})
                }).then(function(response){
                    buildList()
                })
            })
        }
    })
}

form.addEventListener('submit',function(e){
    e.preventDefault();
    let url = 'http://127.0.0.1:8000/api/task-create/'
    let method = 'POST'
    if (activeItem != null){
        url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}`
        method = 'PATCH'
        console.log(url)
        activeItem = null
    }
    const title = document.getElementById('title').value

    fetch(url,{
        method: method,
        headers: {
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body: JSON.stringify({'title':title})
    }).then(function(response){
        buildList()
        document.getElementById('form').reset()
    })
})

buildList()