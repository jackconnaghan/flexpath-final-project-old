import React, { useState, useEffect } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import useFetch from "../hooks/useFetch";
import { useAuthStore } from "../stores/authorizationStore";
import { useWishListStore } from "../stores/useWishListStore";
import { useForm } from "@tanstack/react-form";

export default function AddBookToWishListModalComponent({ selectedRow, modalStyle, open, openModal, closeModal }) {

    const { userLists } = useWishListStore();

    const addBookToListForm = useForm({
        defaultValues: {
            selectedList: "none",
        },
        onSubmit: async ({ value }) => {
            onSearch(value);
        },
        // validators: {
        //     onSubmit
        // }
    });



    //this function acts as the onSubmit function for the Add Book To List modal
    async function onSearch({ title, author }) {

        const params = new URLSearchParams();
        (title.trim()) ? params.set("title", title.trim()) : params.set("title", "");
        (author.trim()) ? params.set("author", author.trim()) : params.set("author", "");
        // fetchSearchData(`/api/books/search?${params}`, "GET");

        //console.log(`base: ${baseURL}`);
    }

    //ensures we don't show something that doesn't exist
    if (!selectedRow) return null;
    return (

        <Modal open={open}
            onClose={closeModal}
        >
            <Box sx={modalStyle}>
                {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        {selectedRow.title}
                    </Typography> */}
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Which list would you like to add {selectedRow.title} to?
                </Typography>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addBookToListForm.handleSubmit({});
                    }}>
                    <addBookToListForm.Field name="selectedList">
                        <label>
                            Lists:
                            {userLists.map(item => {
                                <select>{item.title}</select>
                            })}

                        </label>

                    </addBookToListForm.Field>
                </form>

            </Box>
        </Modal>
    );
}