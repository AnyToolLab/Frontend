<script setup lang="ts">

import miniArrowDownIMG from '../assets/images/mini-arrowdown.svg'
import axios from 'axios'
import { ref } from 'vue'

const fields = [
    // Person
    { key: 'first_name', label: 'First name' },
    { key: 'last_name', label: 'Last name' },
    { key: 'name', label: 'Name' },
    { key: 'name_male', label: 'Male name' },
    { key: 'name_female', label: 'Female name' },

    // Lorem
    { key: 'text', label: 'Text' },

    // Address
    { key: 'address', label: 'Address' },
    { key: 'building_number', label: 'Building number' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'country_code', label: 'Country code' },
    { key: 'postcode', label: 'Postal code' },
    { key: 'street_address', label: 'Street and house number' },
    { key: 'street_name', label: 'Street name' },

    // Automotive
    { key: 'license_plate', label: 'License plate' },
    { key: 'vin', label: 'VIN code' },

    // Bank
    { key: 'aba', label: 'ABA code' },
    { key: 'bank_country', label: 'Country bank' },
    { key: 'bban', label: 'BBAN code' },
    { key: 'iban', label: 'IBAN code' },
    { key: 'swift', label: 'SWIFT code' },

    // Barcode
    { key: 'ean', label: 'EAN barcode' },

    // Color
    { key: 'color_name', label: 'Color name' },
    { key: 'hex_color', label: 'HEX color' },
    { key: 'rgb_color', label: 'RGB color' },

    // Company
    { key: 'company', label: 'Company name' },
    { key: 'bs', label: 'Field of activity' },
    { key: 'catch_phrase', label: 'Company motto' },
    { key: 'company_suffix', label: 'Company suffix' },

    // Credit Card
    { key: 'credit_card_full', label: 'Credit card details' },
    { key: 'credit_card_expire', label: 'Card expiration date' },
    { key: 'credit_card_number', label: 'Card number' },
    { key: 'credit_card_provider', label: 'Card provider' },
    { key: 'credit_card_security_code', label: 'Card security code' },

    // Date Time
    { key: 'date', label: 'Date' },

    // Geo
    { key: 'location_on_land', label: 'Geolocation' },

    // Internet
    { key: 'company_email', label: 'Company email' },
    { key: 'email', label: 'Email' },
    { key: 'domain_name', label: 'Domain name' },
    { key: 'hostname', label: 'Hostname' },
    { key: 'ipv4', label: 'IPv4 address' },
    { key: 'ipv6', label: 'IPv6 address' },
    { key: 'mac_address', label: 'MAC address' },
    { key: 'port_name', label: 'Port' },
    { key: 'slug', label: 'Slug' },
    { key: 'uri', label: 'URI' },
    { key: 'url', label: 'URL' },
    { key: 'user_name', label: 'Username' },

    // Job
    { key: 'job', label: 'Occupation' },

    // Phone Number
    { key: 'phone_number', label: 'Phone number' },

    // User Agent
    { key: 'user_agent', label: 'User Agent' },
]

const saveFormats = ['csv', 'json', 'xml']
const selectedColumns = ref<string[]>([])
const visibleSaveFormats = ref(false)
const currentFormat = ref('...')
const rows = ref(1)

const SERVER_URL = import.meta.env.VITE_SERVER_URL

// TODO: add types

function changeVisibleSaveFormats() {
    visibleSaveFormats.value = !visibleSaveFormats.value
}

function selectFormat(format: string) {
    currentFormat.value = format
}

function selectColumn(item) {
    const index = selectedColumns.value.indexOf(item.key)
    if (index !== -1) {
        selectedColumns.value.splice(index, 1)
    } else {
        selectedColumns.value.push(item.key)
    }
}

function isSelected(item) {
    return selectedColumns.value.includes(item.key)
}

// На випадок вотчів

// function debounce(fn: Function, delay: number) {
//     let timeout
//     return (...args) => {
//         clearTimeout(timeout)
//         timeout = setTimeout(() => fn(...args), delay)
//     }
// }

// const debouncedGenerateQRcode = debounce(() => {
//     generateTable()
// }, 500)

// watch([selectedColumns, currentFormat], debouncedGenerateQRcode)

async function generateTable() {
    if (currentFormat.value === '...') {
        alert('Please select the format')
        return
    }

    const json = JSON.stringify(selectedColumns.value)

    const form = new FormData()
    form.append('fake_data', json)
    form.append('rows', rows.value)
    form.append('save_format', currentFormat.value)

    const response = await axios.post(`${SERVER_URL}/fake-data/generate/`, form)

    const link = document.createElement('a')
    link.href = SERVER_URL + response.data.data.url
    link.download = 'fake_data_file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

</script>

<template>
    <div class="faker">
        <div class="container">
            <h1 class="custom__title">Faker</h1>
            <div class="faker__wrapper">
                <div class="faker__fields">
                    <div
                        v-for="item in fields" 
                        :key="item.key"
                        :class="['faker__fields-item', { 'selected': isSelected(item) }]"
                        @click="selectColumn(item)">
                        {{ item.label }}
                    </div>
                </div>
                <div class="faker__rows">
                    <div class="faker__rows-text">Numbers of rows</div>
                    <input v-model="rows" type="number" class="faker__rows-count">
                </div>
                <div class="faker__preview">

                </div>
                <div class="faker__formats">
                    <div class="faker__formats-text">Save the table in</div>
                    <div class="faker__formats-list"
                        @click="changeVisibleSaveFormats">
                        {{ currentFormat }}
                        <img :src="miniArrowDownIMG" alt="" class="formats__list-img">
                        <div 
                            class="formats__list-items"
                            v-if="visibleSaveFormats">
                            <div
                                v-for="format in saveFormats"
                                @click="selectFormat(format)"
                                class="formats__list-item"
                            >
                                {{ format }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="faker__generate">
                    <button @click="generateTable" class="faker__generate-button">Generate</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.selected {
    background-color: #01257D !important;
    color: #FEFDF9;
}

.faker {
    height: 100%;
    padding-bottom: 200px;
}

.custom__subtitle {
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    margin: 130px 0 32px 0;
}

.faker__wrapper {
    padding-top: 198px;
}

.faker__fields {
    border: 2px solid #01256D;
    border-radius: 20px;
    padding: 12px 14px;
    user-select: none;
}

.faker__fields-item {
    border: 1px solid #01257D0F;
    border-radius: 10px;
    background-color: #B9B9B9;
    padding: 16px;
    font-size: 14px;
    line-height: 21px;
    display: inline-block;
    margin: 4px 6px;
    cursor: pointer;
}

.faker__fields-item:hover {
    background-color: #01257D;
    color: #FEFDF9;
    transition: all 0.2s;
}

.faker__rows {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 25px 0;

}

.faker__rows-text {
    font-size: 20px;
    line-height: 30px;
}

.faker__rows-count {
    width: 28px;
    height: 28px;
    border: 1px solid #01256D;
    border-radius: 5px;
    font-weight: 400;
    font-size: 20px;
    text-align: center;
}

.faker__preview {
    width: 100%;
    height: 224px;
    border: 2px solid #01256D;
    border-radius: 20px;
}

.faker__formats {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
}

.faker__formats-text {
    font-size: 20px;
    line-height: 30px;
}

.faker__formats-list {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid #000;
    border-radius: 11px;
    font-weight: 400;
    font-size: 15px;
    cursor: pointer;
    position: relative;
}

.formats__list-img {
    height: 14px;
    width: 14px;
    margin-left: 10px;
}

.formats__list-items {
    position: absolute;
    z-index: 999;
    top: 38px;
    right: -48px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    border: 1px solid #01257D;
    border-radius: 17px;
}

.formats__list-item {
    background-color: #01257D;
    color: #FEFDF9;
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
}

.formats__list-item:hover {
    background-color: #00AEFF;
    transition: all 0.2s;
}

.faker__generate {
    display: flex;
    justify-content: center;
}

.faker__generate-button {
    background-color: #01256D;
    color: #FEFDF9;
    border-radius: 43px;
    padding: 16px 40px;
    font-weight: 600;
    font-size: 32px;
    line-height: 48px;
}

.faker__generate-button:hover {
    background-color: #00AEFF;
    color: #FEFDF9;
    transition: all 0.2s;
}

</style>
