import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, FONTS, LAYOUT, SPACING } from '../../src/constants/theme';

const PROPERTY_TYPES = [
    { id: 'apartment', label: 'Apartment', icon: 'business' },
    { id: 'house', label: 'House', icon: 'home' },
    { id: 'villa', label: 'Villa', icon: 'business' }, // finding a villa icon, 'business' is generic, maybe 'home' or similar
    { id: 'townhouse', label: 'Townhouse', icon: 'business' },
];

const CONFIGURATIONS = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

export default function RentalPreferencesScreen() {
    const router = useRouter();
    const [purpose, setPurpose] = useState<'Rent' | 'Buy'>('Rent');
    const [minBudget, setMinBudget] = useState('1200');
    const [maxBudget, setMaxBudget] = useState('3500');
    const [selectedPropertyType, setSelectedPropertyType] = useState('apartment');
    const [selectedConfig, setSelectedConfig] = useState('2 BHK');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rental Preferences</Text>
                <TouchableOpacity>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

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
                        <Text style={styles.budgetRangeText}>${minBudget} - ${maxBudget}</Text>
                    </View>

                    <View style={styles.budgetCard}>
                        <View style={styles.sliderContainer}>
                            {/* Placeholder for Slider Visual */}
                            <View style={styles.sliderTrack}>
                                <View style={styles.sliderRange} />
                                <View style={[styles.sliderThumb, { left: '20%' }]} />
                                <View style={[styles.sliderThumb, { left: '70%' }]} />
                            </View>
                        </View>

                        <View style={styles.budgetInputs}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Min</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.currencySymbol}>$</Text>
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
                                    <Text style={styles.currencySymbol}>$</Text>
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
                <TouchableOpacity style={styles.saveButton} onPress={() => router.push('/dashboard/search-results')}>
                    <Text style={styles.saveButtonText}>Save Preferences</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                </TouchableOpacity>

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
});
