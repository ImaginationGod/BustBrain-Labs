import Form from '../models/Form.js';
import Response from '../models/Response.js';
import { uploadToCloudinary } from '../middleware/upload.js';

/* Create a new form */
export async function createForm(req, res, next) {
    try {
        const { title, description, headerImage, questions = [], meta } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const form = new Form({ title, description, headerImage, questions, meta });
        await form.save();

        res.status(201).json(form);
    } catch (err) {
        next(err);
    }
}

/* Get form by id (for preview/fill or editor) */
export async function getForm(req, res, next) {
    try {
        const form = await Form.findOne({ _id: req.params.id }).lean();
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (err) {
        next(err);
    }
}

/* Update form */
export async function updateForm(req, res, next) {
    try {
        const form = await Form.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (err) {
        next(err);
    }
}

/* Delete form */
export async function deleteForm(req, res, next) {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json({ message: 'Form deleted successfully' });
    } catch (err) {
        next(err);
    }
}

/* Submit a response for a form */
export async function submitResponse(req, res, next) {
    try {
        const { id } = req.params; // form id
        const { answers = [], responder } = req.body;

        const form = await Form.findById(id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Get all question IDs as strings (matches frontend UUIDs or string IDs)
        const questionIds = form.questions.map(q => String(q._id));

        // Validate question IDs in submitted answers
        for (const ans of answers) {
            if (!ans.questionId || !questionIds.includes(String(ans.questionId))) {
                return res.status(400).json({
                    message: `Invalid questionId in answers: ${ans.questionId}`
                });
            }
        }

        const responseDoc = new Response({
            formId: form._id, // keep as ObjectId for DB reference
            responder,
            answers, // already strings for questionId
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        await responseDoc.save();

        res.status(201).json({
            message: 'Response saved',
            id: responseDoc._id
        });
    } catch (err) {
        next(err);
    }
}

/* Get responses for a form */
export async function getResponses(req, res, next) {
    try {
        const responses = await Response.find({ formId: req.params.id }).lean();
        res.json(responses);
    } catch (err) {
        next(err);
    }
}

/* Upload image */
export async function uploadImage(req, res, next) {
    try {
        if (!req.file?.buffer) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'form-builder');
        res.json({ url: result.secure_url });
    } catch (err) {
        next(err);
    }
}

/* Get all forms */
export async function getAllForms(req, res, next) {
    try {
        const forms = await Form.find().lean(); // get all forms
        res.json(forms);
    } catch (err) {
        next(err);
    }
}
