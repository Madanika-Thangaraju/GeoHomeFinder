import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, FONTS, LAYOUT, SPACING } from '../../src/constants/theme';

const CONFIGURATIONS = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

const PROPERTY_TYPES = [
    { id: 'apartment', label: 'Apartment', icon: 'business' },
    { id: 'house', label: 'House', icon: 'home' },
    { id: 'villa', label: 'Villa', icon: 'business' }, // finding a villa icon, 'business' is generic, maybe 'home' or similar
    { id: 'PG/Co-living', label: 'PG/Co-living', icon: 'business' },
];

const { width } = Dimensions.get('window');
const GOOGLE_PLACES_API_KEY = "AIzaSyDw84Qp9YXjxqy2m6ECrC-Qa4_yiTyiQ6s";

export default function RentalPreferencesScreen() {
    const router = useRouter();
    const [purpose, setPurpose] = useState<'Rent' | 'Buy' | ''>('');
    const [minBudget, setMinBudget] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('');
    const [selectedConfig, setSelectedConfig] = useState('');

    // New Location State
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState<any[]>([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

    const handleReset = () => {
        setPurpose('');
        setMinBudget('');
        setMaxBudget('');
        setSelectedPropertyType('');
        setSelectedConfig('');
        setSearchQuery('');
        setSelectedLocation(null);
    };

    // fetch predictions
    useEffect(() => {
        const fetchPredictions = async () => {
            if (searchQuery.length < 3 || selectedLocation?.address === searchQuery) {
                setPredictions([]);
                setShowPredictions(false);
                return;
            }
            try {
                const response = await fetch(
                    `https://places.googleapis.com/v1/places:autocomplete`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                        },
                        body: JSON.stringify({
                            input: searchQuery,
                        }),
                    }
                );
                const data = await response.json();
                setPredictions(data.suggestions || []);
                setShowPredictions(true);
            } catch (e) {
                console.error("Predictions error", e);
            }
        };
        const timer = setTimeout(fetchPredictions, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const selectPlace = async (prediction: any) => {
        const placeText = prediction.placePrediction?.text?.text || "";
        setSearchQuery(placeText);
        setShowPredictions(false);
        try {
            const placeId = prediction.placePrediction?.placeId;
            const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${GOOGLE_PLACES_API_KEY}`);
            const data = await response.json();
            if (data.location) {
                setSelectedLocation({
                    lat: parseFloat(data.location.latitude),
                    lng: parseFloat(data.location.longitude),
                    address: placeText
                });
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rental Preferences</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Location Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>LOCATION</Text>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search location..."
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    </View>
                    {showPredictions && predictions.length > 0 && (
                        <View style={styles.predictionsContainer}>
                            {predictions.map((item, idx) => (
                                <TouchableOpacity key={idx} style={styles.predictionItem} onPress={() => selectPlace(item)}>
                                    <Ionicons name="location-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.predictionMain} numberOfLines={1}>{item.placePrediction?.structuredFormat?.mainText?.text}</Text>
                                        <Text style={styles.predictionSub} numberOfLines={1}>{item.placePrediction?.structuredFormat?.secondaryText?.text}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Purpose Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>PURPOSE</Text>
                    <View style={styles.purposeContainer}>
                        <TouchableOpacity
                            style={[styles.purposeButton, purpose === 'Rent' && styles.purposeButtonActive]}
                            onPress={() => setPurpose('Rent')}
                        >
                            <Text style={[styles.purposeText, purpose === 'Rent' && styles.purposeTextActive]}>Rent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.purposeButton, purpose === 'Buy' && styles.purposeButtonActive]}
                            onPress={() => setPurpose('Buy')}
                        >
                            <Text style={[styles.purposeText, purpose === 'Buy' && styles.purposeTextActive]}>Buy</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Monthly Budget Section */}
                <View style={styles.section}>
                    <View style={styles.budgetHeader}>
                        <Text style={styles.sectionLabel}>MONTHLY BUDGET</Text>
                        <Text style={styles.budgetRangeText}>₹{minBudget || '0'} - ₹{maxBudget || '0'}</Text>
                    </View>

                    <View style={styles.budgetCard}>
                        <View style={styles.budgetInputs}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Min</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.currencySymbol}>₹</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={minBudget}
                                        onChangeText={setMinBudget}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <Text style={styles.dash}>-</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Max</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.currencySymbol}>₹</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={maxBudget}
                                        onChangeText={setMaxBudget}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Property Type Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>PROPERTY TYPE</Text>
                    <View style={styles.gridContainer}>
                        {PROPERTY_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.gridItem,
                                    selectedPropertyType === type.id && styles.gridItemActive
                                ]}
                                onPress={() => setSelectedPropertyType(type.id)}
                            >
                                {selectedPropertyType === type.id && (
                                    <View style={styles.checkIcon}>
                                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                                    </View>
                                )}
                                <View style={[styles.iconBox, selectedPropertyType === type.id && styles.iconBoxActive]}>
                                    <Ionicons name={type.icon as any} size={24} color={selectedPropertyType === type.id ? COLORS.primary : COLORS.textSecondary} />
                                </View>
                                <Text style={styles.gridLabel}>{type.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Configuration Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>CONFIGURATION</Text>
                    <View style={styles.chipsContainer}>
                        {CONFIGURATIONS.map((config) => (
                            <TouchableOpacity
                                key={config}
                                style={[
                                    styles.chip,
                                    selectedConfig === config && styles.chipActive
                                ]}
                                onPress={() => setSelectedConfig(config)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    selectedConfig === config && styles.chipTextActive
                                ]}>{config}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={async () => {
                        try {
                            const prefs = {
                                purpose,
                                minBudget,
                                maxBudget,
                                selectedPropertyType,
                                selectedConfig,
                                location: selectedLocation
                            };
                            await AsyncStorage.setItem('rentalPreferences', JSON.stringify(prefs));
                            console.log("RentalPreferences: Saved preferences:", prefs);
                            router.push('/dashboard/search-results');
                        } catch (error) {
                            console.error("Failed to save rental preferences", error);
                        }
                    }}
                >
                    <Text style={styles.saveButtonText}>Apply Filters</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.l,
    },
    backButton: {
        padding: SPACING.xs,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        ...LAYOUT.shadow,
    },
    headerTitle: {
        fontSize: FONTS.sizes.h3,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    resetText: {
        color: COLORS.textSecondary,
        fontSize: FONTS.sizes.body,
    },
    scrollContent: {
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionLabel: {
        fontSize: FONTS.sizes.small,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    /* Purpose Styles */
    purposeContainer: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: LAYOUT.radius.m,
        padding: 4,
    },
    purposeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: LAYOUT.radius.s,
    },
    purposeButtonActive: {
        backgroundColor: COLORS.white,
        ...LAYOUT.shadow,
    },
    purposeText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    purposeTextActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    /* Budget Styles */
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    budgetRangeText: {
        fontSize: FONTS.sizes.h3,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    budgetCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24, // Large rounded corners as per design (approx 20-24)
        padding: SPACING.l,
        ...LAYOUT.shadow,
    },
    sliderContainer: {
        height: 40,
        justifyContent: 'center',
        marginBottom: SPACING.m,
    },
    sliderTrack: {
        height: 6,
        backgroundColor: '#F1F5F9', // Slightly Lighter track inside white card
        borderRadius: 3,
        position: 'relative',
    },
    sliderRange: {
        position: 'absolute',
        left: '20%',
        right: '30%',
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    sliderThumb: {
        position: 'absolute',
        top: -9,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
        ...LAYOUT.shadow,
    },
    budgetInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        marginBottom: 4,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC', // Input background inside card
        borderRadius: LAYOUT.radius.m,
        paddingHorizontal: SPACING.m,
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    currencySymbol: {
        fontSize: FONTS.sizes.body,
        color: COLORS.textSecondary,
        marginRight: SPACING.xs,
    },
    input: {
        flex: 1,
        fontSize: 16, // Adjusted font size
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    dash: {
        marginHorizontal: SPACING.m,
        color: COLORS.textSecondary,
        fontSize: 20,
    },
    /* Grid Styles */
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.m,
    },
    gridItem: {
        width: '47%', // 2 columns with gap
        aspectRatio: 1.2,
        backgroundColor: COLORS.white,
        borderRadius: LAYOUT.radius.l,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...LAYOUT.shadow,
    },
    gridItemActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#EFF6FF',
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    iconBoxActive: {
        backgroundColor: '#DBEAFE', // lighter primary
    },
    gridLabel: {
        fontSize: FONTS.sizes.body,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    /* Chips Styles */
    chipsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chip: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    chipActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#EFF6FF', // Light blue bg
    },
    chipText: {
        fontSize: FONTS.sizes.small,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    chipTextActive: {
        color: COLORS.primary,
    },
    /* Fab Button */
    saveButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.m,
        borderRadius: LAYOUT.radius.l, // Pill shape often used for big actions
        gap: SPACING.s,
        ...LAYOUT.shadow,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.4,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: FONTS.sizes.body,
        fontWeight: 'bold',
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 14,
        alignItems: 'center',
        ...LAYOUT.shadow,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    predictionsContainer: {
        backgroundColor: COLORS.white,
        marginTop: 5,
        borderRadius: 12,
        padding: 8,
        maxHeight: 250,
        ...LAYOUT.shadow,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    predictionMain: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    predictionSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
});
