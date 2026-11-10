import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authorizationStore";
import { useParams } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import { useWishListStore } from "../stores/useWishListStore";
import { apiFetch } from "../logic/api";
import ErrorBoundary from "../components/ErrorBoundary";

export default function ListDetailPage() {
    return (
        <div className="extend-under-navbar search-just">
            <RequireAuth role="ROLE_USER">
                <ListDetails />
            </RequireAuth>
        </div>
    );
}

function ListDetails() {
    //without brackets,
    //this declaration would pull an object
    //containing every param, not just the listId
    //(which gets parsed as a String, even though its a digit)
    const { listId } = useParams();

    //pull username
    const username = useAuthStore((s) => s.user.username);

    //pull details of list
    const list = useWishListStore((s) =>
        //.find is javascript built-in,
        //useful for stores
        //find((l) ...) finds the first item in the array for which the test function is true
        //l (not 1, one) is the list/item in the array
        //loops through each item in the array until it finds one that passes the test
        s.userLists[username]?.find((l) => String(l.id) === listId)
    );

    const [booksInList, setBooksInList] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [bookReviews, setBookReviews] = useState(null);

    async function removeBookFromList(book_id, wishlist_id) {
        try {
            await apiFetch(`/api/wishlists/list/${listId}`, { method: "DELETE", body: book_id });
            setBooksInList((previousList) => previousList.filter((p) => p.id !== book_id));
        } catch (err) {
            setLocalError(err);
        }
    }
    //used to have an apiFetch to get the reviewId, but
    //I put the reviewId in the booksInList apiFetch instead
    //which means it arrives in the useEffect
    async function handleReviewChange(book_id, review_id, action) {
        switch (action) {
            case "DELETE":
                try {
                    await apiFetch(`/api/reviews/delete/${review_id}`, { method: action });
                    setBooksInList((previousList) =>
                        //maps through the previousList 
                        previousList.map((p) =>
                            //takes the id of the list and matches the book_id,
                            //then copies everything in book BUT sets review_id and review_text to null
                            p.id === book_id ? { ...p, review_id: null, review_text: null } : p
                        ));
                } catch (err) {
                    setLocalError(err);
                }
                break;
            default:
                console.log("oops!");
                break;

        }

        // try {
        //     await apiFetch(`/api/reviews/user/${username}`)
        // } catch (err) {
        //     setLocalError(err);
        // }
    }
    useEffect(() => {
        //similar to the AddToWishListComponent, 
        //cancelled is a tracking variable
        //that gets set to true as soon as the useEffect ends.
        //Since the apiFetch is async, 
        //if the component is unmounted before it finishes the call,
        //apiFetch returns undefined.
        //basically makes sure
        let cancelled = false;
        setBooksInList(null);
        setLocalError(null);

        //fetch data and put it in booksInList
        // try {
        //     const data = apiFetch(`/api/wishlists/list/${listId}`);
        //     if (cancelled != true) {
        //         setBooksInList(data);
        //     };
        // } catch (err) {
        //     if (cancelled != true) {
        //         setLocalError(err);
        //     }
        // }
        //same thing but in a thing.then.catch 
        apiFetch(`/api/wishlists/list/${listId}`)
            .then((data) => { if (cancelled != true) setBooksInList(data) })
            .catch((err) => {
                if (cancelled != true) setLocalError(err)
            }
            );

        return () => cancelled = true;
    }, [listId]);

    console.log(`list stuff:`, list);

    //books might be empty, which means map can't run.
    //need to place constraints to check if book is empty.
    //{booksInList?.length < 0}
    return (
        <>
            <h1>Hai</h1>
            {booksInList <= 0 && !localError &&
                <h3 className="text-warn text-warning">You can't do that! For no particular reason!</h3>
            }
            {localError &&
                <h3 className="text-warn text-warning">You can't do that! {localError.message}</h3>
            }
            <ErrorBoundary error={localError}>
                {booksInList?.length > 0 &&
                    <div className="extend-under-navbar">
                        <h1>listId: {listId}</h1>
                        <table className="table w-auto">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Your Review</th>
                                </tr>

                            </thead>
                            <tbody>
                                {booksInList.map((book) => (
                                    <tr key={book.id}>
                                        <td>
                                            <button type="button" onClick={(e) => {
                                                e.preventDefault();
                                                removeBookFromList(book.id, listId);
                                            }}>Remove From List</button>
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => handleReviewChange(book.id, book.review_id, "DELETE")}>Delete Review</button>
                                        </td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.review_text}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div >}
            </ErrorBoundary>
        </>

    )
}