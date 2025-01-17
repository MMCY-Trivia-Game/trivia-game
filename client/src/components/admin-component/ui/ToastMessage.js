import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const notify = (message, type) => {
    toast(message, {
        autoClose: 5000,
        "theme": "light",
        "type": type,
        "position": 'top-center'
    });
}

export default notify