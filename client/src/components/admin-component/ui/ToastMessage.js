import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const notify = (message, type) => {
    toast(message, {
        autoClose: 3000,
        "theme": "light",
        "type": type,
    });
}

export default notify