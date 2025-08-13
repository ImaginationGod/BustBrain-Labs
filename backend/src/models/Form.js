import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Question structure:
 * - _id: string (frontend-generated UUID optional)
 * - type: 'categorize' | 'cloze' | 'comprehension'
 * - title, description, image (optional)
 * - settings: flexible object based on type
 * - required: boolean
 */

const QuestionSchema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() }, // optional UUID for frontend
    type: { type: String, required: true }, // 'categorize' | 'cloze' | 'comprehension'
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    settings: { type: Schema.Types.Mixed, default: {} },
    required: { type: Boolean, default: false }
}, { _id: false }); // prevent Mongoose from creating its own _id for subdocs

const FormSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    headerImage: { type: String, default: '' },
    questions: { type: [QuestionSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    meta: { type: Schema.Types.Mixed, default: {} }
});

FormSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Form', FormSchema);
