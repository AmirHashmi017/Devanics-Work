import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useEffect, useState, useCallback } from "react";
import jsonData from "./features.json";

const WorldMap = ({ countriesUser }) => {
    const [countriesData, setCountriesData] = useState({});
    const [tooltip, setTooltip] = useState({
        visible: false,
        x: 0,
        y: 0,
        content: {},
    });

    useEffect(() => {
        if (countriesUser && countriesUser.length > 0) {
            const userCountriesData = {};
            countriesUser.forEach(({ countryName, totalUsers }) => {
                userCountriesData[countryName] = { users: Number(totalUsers || 0) || 0 };
            });
            setCountriesData(userCountriesData);
        }
    }, [countriesUser]);

    // Memoize country name extraction to avoid repetition
    const getCountryName = useCallback((geo) => {
        return geo.properties?.NAME ||
            geo.properties?.NAME_EN ||
            geo.properties?.NAME_LONG ||
            geo.properties?.ADMIN ||
            geo.properties?.SOVEREIGNT ||
            geo.properties?.NAME_SORT ||
            geo.properties?.name ||
            geo.properties?.admin ||
            "Unknown Country";
    }, []);

    const handleMouseEnter = useCallback((geo, event) => {
        const countryName = getCountryName(geo);
        const data = countriesData[countryName] || { users: 0 };

        setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            content: {
                name: countryName,
                users: data.users,
            },
        });
    }, [countriesData, getCountryName]);

    const handleMouseLeave = useCallback(() => {
        setTooltip(prev => ({ ...prev, visible: false }));
    }, []);

    const handleMouseMove = useCallback((geo, event) => {
        if (tooltip.visible) {
            const countryName = getCountryName(geo);
            const data = countriesData[countryName] || { users: 0 };

            setTooltip({
                visible: true,
                x: event.clientX,
                y: event.clientY,
                content: {
                    name: countryName,
                    users: data.users,
                },
            });
        }
    }, [tooltip.visible, countriesData, getCountryName]);

    // Function to get dynamic colors based on user data
    const getCountryColors = useCallback((geo) => {
        const countryName = getCountryName(geo);
        const userData = countriesData[countryName];
        const hasUsers = userData && userData.users > 0;

        return {
            default: {
                fill: hasUsers ? "#2a354d" : "#D6D6DA",
                outline: "none",
                stroke: "#FFFFFF",
                strokeWidth: 0.5,
                opacity: hasUsers ? 0.8 : 0.6,
            },
            hover: {
                fill: hasUsers ? "#2a354d" : "#2a354d",
                outline: "none",
                stroke: "#FFFFFF",
                strokeWidth: 1,
                cursor: "pointer",
                opacity: 1,
            },
            pressed: {
                fill: hasUsers ? "#2a354d" : "#2a354d",
                outline: "none",
                stroke: "#FFFFFF",
                strokeWidth: 1,
                opacity: 1,
            },
        };
    }, [countriesData, getCountryName]);

    return (
        <div style={{ position: "relative" }} className="world-map-container">
            <ComposableMap>
                <Geographies geography={jsonData}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onMouseEnter={(event) => handleMouseEnter(geo, event)}
                                onMouseMove={(event) => handleMouseMove(geo, event)}
                                onMouseLeave={handleMouseLeave}
                                style={getCountryColors(geo)}
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>
            {/* Tooltip */}
            {tooltip.visible && tooltip.content.name && (
                <div
                    style={{
                        position: "fixed",
                        left: Math.min(tooltip.x + 10, window.innerWidth - 180), // Prevent overflow
                        top: Math.max(tooltip.y - 10, 10), // Prevent top overflow
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        color: "white",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "Arial, sans-serif",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                        zIndex: 1000,
                        pointerEvents: "none",
                        minWidth: "160px",
                        maxWidth: "200px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <div style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}>
                        {tooltip.content.name}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#ccc" }}>Users:</span>
                            <span style={{ fontWeight: "bold", color: "#4CAF50" }}>
                                {tooltip.content.users !== undefined ?
                                    tooltip.content.users.toLocaleString() :
                                    'N/A'
                                }
                            </span>
                        </div>
                        {tooltip.content.users === 0 && (
                            <div style={{
                                fontSize: "12px",
                                color: "#999",
                                fontStyle: "italic",
                                marginTop: "4px"
                            }}>
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorldMap;