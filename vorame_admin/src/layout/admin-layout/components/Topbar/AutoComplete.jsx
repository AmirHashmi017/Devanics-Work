import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import { modulesHasmap } from 'pages';

export default function ProjectModulesAutocomplete() {
    const navigate = useNavigate(null);
    const [selectedModule, setSelectedModule] = useState(null)

    useEffect(() => {
        if (selectedModule) {
            navigate(modulesHasmap[selectedModule])
        }
    }, [selectedModule])


    return (
        <Autocomplete
            freeSolo
            clearOnBlur
            value={selectedModule}
            onChange={(_, value) => setSelectedModule(value)}
            options={modules}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size='small'
                    sx={{ bgcolor: '#F4F5F6', border: 'none' }}
                    placeholder='What are you looking for'

                    slotProps={{
                        input: {
                            ...params.InputProps,
                            type: 'search',
                        },
                    }}
                />
            )}
        />
    );
}

const modules = ["Blogs",
    "Blue Print",
    "Book Club",
    "Clips",
    "Library",
    "Whistle",
    "Dashboard",
    "Lounges",
    "Tapes",
    "Practice",
    "Users",
    "Add User",
    "Plans",
    "Promotions",
    "Promos",
    "Faqs",];