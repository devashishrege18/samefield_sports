��import React from 'react';

import { Search, MapPin, Ticket, UserPlus, ShoppingBag, Heart, Globe, Briefcase, Leaf, ArrowRight } from 'lucide-react';

import MerchandiseCard from '../components/MerchandiseCard'

import { merchandiseItems } from '../data/merchandiseData'



const Discover = () => {



    // START: Task 2 - Define the API Call Handler

    const handleSupportClick = async (athleteName) => {

        try {

            // Send POST request to the API endpoint defined at app/api/support/route.js

            const response = await fetch('/api/support', {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                // Send the athlete's name as the identifier (athleteId)

                body: JSON.stringify({ athleteId: athleteName }), 

            });



            const result = await response.json();



            if (response.ok) {

                // Success! The backend recorded the support.

