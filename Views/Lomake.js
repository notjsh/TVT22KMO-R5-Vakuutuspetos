import React from "react";
import { useLayoutEffect } from "react";

export default function Lomake({navigation}){
    useLayoutEffect(()=>{
        navigation.setOptions({
            headerStyle:{
                backgroundColor: 'steelblue'
            }
            
        })
    }, [])
}