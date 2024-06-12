<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>CRUD de Itens</h1>
                <v-form @submit.prevent="addItem">
                    <v-text-field v-model="newItemName" label="Nome do item" required></v-text-field>
                    <v-btn type="submit" color="primary">Adicionar Item</v-btn>
                </v-form>
                <v-list>
                    <v-list-item v-for="item in items" :key="item.id">
                        <v-list-item-content>
                            <v-text-field v-model="item.name" @blur="updateItem(item)" label="Nome do item"
                                required></v-text-field>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn color="red" @click="deleteItem(item.id)">
                                Excluir
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const items = ref([]);
const newItemName = ref('');

const fetchItems = async () => {
    const response = await fetch('http://localhost:5000/items');
    items.value = await response.json();
};

const addItem = async () => {
    if (newItemName.value) {
        const response = await fetch('http://localhost:5000/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newItemName.value })
        });
        const newItem = await response.json();
        items.value.push(newItem);
        newItemName.value = '';
    }
};

const updateItem = async (item) => {
    await fetch(`http://localhost:5000/items/${item.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
};

const deleteItem = async (id) => {
    await fetch(`http://localhost:5000/items/${id}`, {
        method: 'DELETE'
    });
    items.value = items.value.filter(item => item.id !== id);
};

onMounted(() => {
    fetchItems();
});
</script>
