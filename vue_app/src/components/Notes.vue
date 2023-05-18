<script setup>

import { ref, reactive, onMounted } from 'vue'


const notes = reactive([...Array(3).keys()].map(() => {
    return {date: '', title: '1'}
}));
let currentNote = ref({note: ''});

onMounted(readTable)

async function readTable() {
    let response = await fetch("/notes");
    const temp = await response.json()
    notes.length = 0
    for(let el of temp){
        notes.push(el)
    }
    notes.map((value) => value['edit'] = false);

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function saveNote(note) {
    console.log("save note " + note)
    //TODO: запись нужно делать, только если есть изменения
    //для этого текущий редактируемый элемент должен быть отдельной переменной
    //и сравнивать с тем, что в notes
    if (note['edit'] === false) return

    note['edit'] = false;
    var csrftoken = getCookie('csrftoken');
    fetch("/save", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(note),
        credentials: 'include'
    }).then(() => console.log("save success"));
}

function onSelectRow(note) {
    if (currentNote.value !== note) {
        notes.map((value) => saveNote(value));
        currentNote.value = note;
    }
}

function onEditClick(event, note) {
    note["edit"] = true;
    currentNote.value = note;
    event.stopPropagation();
}

function add() {
    notes.push({date: new Date().toISOString().slice(0, 10), title: "новая заметка"});
}
</script>

<template>
    <h3>Заметки</h3>
    <table>
        <thead>
        <tr>
            <th>Дата</th>
            <th>Название</th>
            <th colspan="2">
                <button class="btnadd" @click="add">Добавить</button>
            </th>
        </tr>
        </thead>
        <tbody>

        <tr v-for="note in notes" @click="event => onSelectRow(note)">

            <td v-if="note.edit"><input class="editable" type="date" v-model="note.date"></td>
            <td v-else>{{ note.date }}</td>
            <td v-if="note.edit"><input class="editable" v-model="note.title"></td>
            <td v-else>{{ note.title }}</td>
            <td>
                <button @:click="event => onEditClick(event, note)">Edit</button>
            </td>
            <td><a href="notes/{note.slug}/">Details</a></td>
        </tr>

        </tbody>
    </table>

    <input v-if="currentNote.edit" class="note editable" v-model="currentNote.note">
    <div v-else class="note noteditable">{{ currentNote.note }}</div>
</template>

<style>

.btnadd {
    background-color: #4ca62b;
}

.editable {
    border: 2px solid #7b82ff;
}

.editable:focus {
    outline: none !important;
    border: 2px solid #ff7b8f;
    box-shadow: 0 0 10px #719ECE;
}

.noteditable {
    border: 2px solid #242424;
}

.note {
    min-height: 100px;
    width: 100%;
}

table {
    width: 100%;
    margin-bottom: 20px;
}

thead {
    background: #fafafa;
}

tbody td {
    border: 1px solid #f5f5f5;
    padding: 4px 20px;
}

tbody tr {
    transition: all, 0.2s;
}

tbody tr:hover {
    background: #f5f5f5;
}
</style>