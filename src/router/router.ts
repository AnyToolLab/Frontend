import { createMemoryHistory, createRouter } from 'vue-router'

import Main from '../pages/Main.vue'
import QRcode from '../pages/QRcode.vue'
import IMGconvertor from '../pages/IMGconvertor.vue'
import Faker from '../pages/Faker.vue'
import CropImage from '../pages/CropImage.vue'
import BGremover from '../pages/BGremover.vue'


const routes = [
    { path: '/', component: Main },
    { path: '/qrcode-generator', component: QRcode },
    { path: '/img-convertor', component: IMGconvertor },
    { path: '/faker', component: Faker },
    { path: '/crop-image', component: CropImage },
    { path: '/bg-remover', component: BGremover }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router