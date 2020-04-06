const express = require('express');
const router = express.Router();

// Models
const Note = require('../models/Note');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please Write a Title' });
    }
    if (!description) {
        errors.push({ text: 'Please Write a Descripcion' });
    }
    // Pregunta si hay errores en los datos
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully');
        res.redirect('/notes');
    }
});

// Get All Notes
router.get('/notes', isAuthenticated, async (req, res) => {
    // const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    // res.render('notes/all-notes', { notes });

    await Note.find({user: req.user.id}).sort({date: 'desc'})
        .then(documentos => {
            const contexto = {
                notes: documentos.map(documento => {
                    return {
                        title: documento.title,
                        description: documento.description,
                        date: documento.date,
// Ojo Aspee                        _id: documento._id
                        id: documento.id
                    }
                })
            }
            // console.log(contexto.notes)
            res.render('notes/all-notes', { notes: contexto.notes })
        })

});

// Edit Notes
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    // await notes = Note.findById(req.params.id);
    // res.render('notes/edit-notes', { notes});
    const note = await Note.findById(req.params.id)
    .then(data =>{
        return {
            title: data.title,
            description: data.description,
            id: data.id
        }
    });

    if(note.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        return res.redirect('notes');
    }

    res.render('notes/edit-notes',{note})
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) =>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note Updated Successfuly');
    res.redirect('/notes');
});

// Delete Notes
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfuly');
    res.redirect('/notes');
});

module.exports = router;