import React, { useState, useEffect } from "react";
import RequireAuth from "./RequireAuth";
// import keycloak from "../keycloak";
import { useAuthStore, syncAuthFromKeycloak } from "../stores/authorizationStore";
import useFetch from "../hooks/useFetch";
import { useWishListStore } from "../stores/useWishListStore";
import { NavLink } from "react-router-dom";

export default function ListsComponent({ user, lists }) {
    // const status = useAuthStore((s) => s.status);
    // const user = useAuthStore((s) => s.user);

    //const { fetchSearchData, setResponse } = useFetch();

    //const lists = useWishListStore((s) => s.userLists[user]);
    const addList = useWishListStore((s) => s.addList);
    const removeList = useWishListStore((s) => s.removeList);
    // const loadLists = useWishListStore((s) => s.loadLists);

    // useEffect(() => {
    //     // const fetchedResponse = fetchUserLists(baseURL, "GET");
    //     // addList(user, fetchedResponse);
    // }, []);

    return (
        <>
            <h4>Hello, {user}</h4>
            <h4>Here are your lists...</h4>
            {(lists?.length === 0 ? (
                <>
                    <h3>You don't have any lists. Create one with the button below.</h3>
                    <button>Make a List</button>
                </>
            )
                : (
                    <table>
                        <thead></thead>
                        <tbody>
                            {/* Stole this from the SearchTableComponent */}

                            {lists.map(item => (
                                //pass the iterator at the top level
                                <tr className="col" key={item["list_title"]}>

                                    <td>
                                        <NavLink to={`/my-lists/${item["list_title"]}/`}>
                                            {item["list_title"]}
                                            </NavLink></td>
                                    {/* <td>{item["is_public"]}</td> */}
                                    {/* <td>
                                        <button type="link" className="col" onClick={(e) => { }}>
                                            View List
                                        </button>
                                    </td> */}

                                </tr>


                            ))}
                        </tbody>
                    </table>
                ))}

        </>
    )
}