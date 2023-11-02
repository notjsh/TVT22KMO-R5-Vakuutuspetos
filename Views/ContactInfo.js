import React from "react";
import { useLayoutEffect } from "react";

export default function Contact({navigation}){
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerStyle:{
                backgroundColor: 'steelblue'
            }
            
        })
    }, [])
}