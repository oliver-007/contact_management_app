import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const cmaApiSlice = createApi({
  reducerPath: "cmaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL, // coming form .env file
  }),
  endpoints: (builder) => ({
    // -------- CREATE CONTACT ---------
    createContact: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/contacts/create-contact",
        method: "POST",
        body: formData,
      }),
    }),

    // ------- UPDATE CONTACT --------
    updateContactInfo: builder.mutation({
      query: ({ formData, cId }) => ({
        url: `/api/v1/contacts/update-contact?cId=${cId}`,
        method: "PATCH",
        body: formData,
      }),
    }),

    // --------- DELETE CONTACT ----------
    deleteContact: builder.mutation({
      query: (cId) => ({
        url: `/api/v1/contacts/delete-contact?cId=${cId}`,
        method: "DELETE",
      }),
    }),

    // -------- GET ALL CONTACTS --------
    getAllContacts: builder.query({
      query: () => "/api/v1/contacts",
    }),
  }),
});

export const {
  // ******** USER ********
  useCreateContactMutation,
  useUpdateContactInfoMutation,
  useDeleteContactMutation,
  useGetAllContactsQuery,
} = cmaApiSlice;
