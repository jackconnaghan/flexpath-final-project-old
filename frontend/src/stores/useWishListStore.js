import { create } from "zustand";
import { apiFetch } from "../logic/api";

export const useWishListStore = create((set, get) => ({
    //another zustand create set.
    //userLists is an empty object, which can be null
    //and refers to a single user's lists
    userLists: {},
    //new variables for setting state from apiFetch
    listsLoading: false,
    listsError: null,
    //new loadLists
    loadLists: async (username) => {
        //"get" a snapshot of the current values of these variables,
        //NOT THEIR DEFAULTS (unless they haven't changed yet)
        const { userLists, listsLoading } = get();
        if (userLists[username] !== undefined || listsLoading) return;

        set({ listsLoading: true, listsError: null});
        try {
            //try the wishlist fetch
            const response = await apiFetch(`/api/wishlists/mine`);
            set((s) => ({
                userLists: {...s.userLists, [username]: response},
                listsLoading: false,
            }));
        } catch (err) {
            set({listsLoading: false, listsError: err.message});
        }
    },

    //setList fetches the list of lists on first load of the component that uses it.
    //sets userLists equal to userLists plus the lists that come with the username
    //(since we track users by username only, no ID)
    setLists: (username, lists) => 
        set((s) => ({userLists: { ...s.userLists, [username]: lists } })),
    //addList adds a new list to the userLists object.
    //sets userLists equal to userLists plus the lists that come with the username.
    //
    addList: (username, list) => 
        set((s) => ({userLists: { ...s.userLists, [username]: [...(s.userLists[username] ?? []), list] },})),
    removeList: (username, id) =>
        set((s) => ({
            userLists: {
                ...s.userLists,
                [username]: (s.userLists[username] ?? []).filter((l) => l.id !== id),
            },
        })),
    invalidate: (username) =>
        set((s) => {
            const copy = { ...s.userLists };
            delete copy[username];
            return { userLists: copy };
        }),
    clearAll: () => set({ userLists: {} }),

}));

//sample calls: 
/*
this will add a new list to a user's WishLists ON THE LOCAL STORE.
it will NOT update the WishLists table in the backend.

    addList("user", {id: 1, name:"My Favorite Books"});
*/