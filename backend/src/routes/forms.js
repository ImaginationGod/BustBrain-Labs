// formsRoutes.js
import express from 'express';
import {
    createForm,
    getForm,
    getAllForms,
    updateForm,
    deleteForm,
    submitResponse,
    getResponses,
    uploadImage
} from '../controllers/formsController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// form CRUD
router.post('/forms', createForm);
router.get('/forms', getAllForms);
router.get('/forms/:id', getForm);
router.put('/forms/:id', updateForm);
router.delete('/forms/:id', deleteForm);

// responses
router.post('/forms/:id/responses', submitResponse);
router.get('/forms/:id/responses', getResponses);

// image upload
router.post('/upload', upload.single('file'), uploadImage);

export default router;
