import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Response schema:
 * - formId: ObjectId (still references the Form document itself)
 * - answers: questionId is a string (matches Form.questions._id from frontend)
 */

const AnswerSchema = new Schema({
    questionId: { type: String, required: true }, // match frontend UUID
    value: { type: Schema.Types.Mixed } // can be string, array, object depending on type
});

const ResponseSchema = new Schema({
    formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
    responder: {
        name: String,
        email: String,
        meta: Schema.Types.Mixed
    },
    answers: { type: [AnswerSchema], default: [] },
    ip: String,
    userAgent: String,
    submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Response', ResponseSchema);
