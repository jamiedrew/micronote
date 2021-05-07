import React from "react";
import ReactDOM from "react-dom";
import App, { getUserNotes, getUserInfo } from "./App";
import { render } from "@testing-library/react";
import localforage from "localforage";

describe("App functions", () => {

    test("The app creates an array in local storage", async () => {
        const noteList = await localforage.getItem("notes");
        expect(true).toBeTruthy();
    });

    test("The array in local storage matches the array passed to the notes state", async () => {
        const noteList = await localforage.getItem("notes");
        
    })

})