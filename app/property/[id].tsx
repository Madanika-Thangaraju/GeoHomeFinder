import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../src/constants/theme';
import { PROPERTIES } from '../../src/data/properties';
import { createCallRequestApi, createTourRequestApi, getCallRequestsApi, getLikedPropertiesApi, getProperty, likePropertyApi } from '../../src/services/service';

const { width, height } = Dimensions.get('window');

// Helper to generate next 7 days
const getNext7Days = () => {
    const days = [];
    const today = new Date();
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push({
            id: i,
            dayName: weekDays[date.getDay()],
            dayNum: date.getDate(),
            month: months[date.getMonth()],
            fullDate: date.toISOString().split('T')[0]
        });
    }
    return days;
};

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function PropertyDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const idString = Array.isArray(id) ? id[0] : id;
    const [property, setProperty] = useState<any>(PROPERTIES.find(p => p.id === Number(idString)) || PROPERTIES[0]);
    const [loading, setLoading] = useState(true);

    // State for Modal and Selection
    const [isTourModalVisible, setIsTourModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(0);
    const [userTimeInput, setUserTimeInput] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [isRequesting, setIsRequesting] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState<'none' | 'pending' | 'accepted'>('none');
    const [ownerPhone, setOwnerPhone] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    React.useEffect(() => {
        fetchPropertyData();
    }, [idString]);

    const checkFavoriteStatus = async (propId: number) => {
        try {
            const likedProps = await getLikedPropertiesApi();
            if (Array.isArray(likedProps)) {
                const found = likedProps.some((p: any) => p.id === propId || p.property_id === propId);
                setIsFavorite(found);
            }
        } catch (error) {
            console.log("Error checking favorite status", error);
        }
    };

    const handleToggleFavorite = async () => {
        if (isTogglingFavorite) return;

        try {
            setIsTogglingFavorite(true);
            const newStatus = !isFavorite;
            await likePropertyApi(idString, newStatus);
            setIsFavorite(newStatus);
            // Optionally show feedback
        } catch (error: any) {
            console.error("Failed to toggle favorite:", error);
            Alert.alert("Error", "Could not update favorite status");
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const checkCallStatus = async (ownerId: number) => {
        try {
            const res = await getCallRequestsApi('tenant');
            if (res.success && Array.isArray(res.data)) {
                const myRequest = res.data.find((r: any) => r.owner_id === ownerId);
                if (myRequest) {
                    setCallStatus(myRequest.status);
                    if (myRequest.status === 'accepted') {
                        setOwnerPhone(myRequest.other_phone);
                    }
                }
            }
        } catch (error) {
            console.log("Error checking call status", error);
        }
    };

    const handleCallRequest = async () => {
        if (callStatus === 'accepted') {
            Alert.alert(
                "Owner Contact Info",
                `Contact ${property.owner.name} at: ${ownerPhone}`,
                [
                    { text: "Call Now", onPress: () => Linking.openURL(`tel:${ownerPhone}`) },
                    { text: "Close", style: "cancel" }
                ]
            );
            return;
        }

        if (callStatus === 'pending') {
            Alert.alert("Request Pending", "Your call request is still pending approval from the owner.");
            return;
        }

        try {
            setIsCalling(true);
            await createCallRequestApi(property.owner.id);
            setCallStatus('pending');
            Alert.alert(
                "Call Request Sent!",
                `Your request to call ${property.owner.name} has been sent. Once accepted, their number will be visible here.`,
                [{ text: "OK" }]
            );
        } catch (error: any) {
            console.error("Failed to send call request:", error);
            Alert.alert("Error", error.message || "Failed to send call request. Please try again.");
        } finally {
            setIsCalling(false);
        }
    };

    const fetchPropertyData = async () => {
        try {
            setLoading(true);
            const data = await getProperty(idString);
            if (data) {
                // The data from service.ts is already mapped by mapProperty in the backend
                setProperty({
                    ...data,
                    // data.image is already { uri: '...' }
                    // data.owner is already an object with name, image: { uri: '...' }, etc.
                    latitude: data.location?.lat || parseFloat(data.latitude) || 11.0168,
                    longitude: data.location?.lng || parseFloat(data.longitude) || 76.9558,
                    match: data.match || `${Math.floor(Math.random() * 20) + 80}% Fit`
                });
                if (data.owner?.id) {
                    checkCallStatus(data.owner.id);
                }
                checkFavoriteStatus(Number(idString));
            }
        } catch (error) {
            console.error("Failed to fetch property details:", error);
        } finally {
            setLoading(false);
        }
    };

    const GOOGLE_PLACES_API_KEY = "AIzaSyDw84Qp9YXjxqy2m6ECrC-Qa4_yiTyiQ6s";

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const availableDays = getNext7Days();

    const handleGetDirections = () => {
        const { latitude, longitude } = property;
        if (!latitude || !longitude) {
            Alert.alert("Location not available", "Coordinates for this property are missing.");
            return;
        }

        const url = Platform.select({
            ios: `maps://app?daddr=${latitude},${longitude}`,
            android: `google.navigation:q=${latitude},${longitude}`,
            default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
        });

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                // Fallback to web URL
                Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
            }
        });
    };

    const handleConfirmTour = async () => {
        if (!userTimeInput.trim()) {
            Alert.alert("Wait", "Please specify a time for your tour.");
            return;
        }

        try {
            setIsRequesting(true);
            const tourDate = availableDays[selectedDate].fullDate;

            await createTourRequestApi({
                owner_id: property.owner.id,
                property_id: Number(idString),
                tour_date: tourDate,
                tour_time: userTimeInput,
                message: userMessage
            });

            setIsTourModalVisible(false);
            Alert.alert(
                "Tour Request Sent!",
                `Your request for ${availableDays[selectedDate].month} ${availableDays[selectedDate].dayNum} at ${userTimeInput} has been sent to ${property.owner.name}.`,
                [{
                    text: "Done", onPress: () => {
                        setUserTimeInput('');
                        setUserMessage('');
                    }
                }]
            );
        } catch (error: any) {
            console.error("Failed to send tour request:", error);
            Alert.alert("Error", error.message || "Failed to send tour request. Please try again.");
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Scrollable Content */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* HERO SECTION */}
                <View style={styles.heroContainer}>
                    <Image source={property.image} style={styles.heroImage} resizeMode="cover" />

                    {/* Gradient Overlay for Text Readability */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFillObject}
                    />

                    {/* Header Actions */}
                    <View style={styles.headerBar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={styles.rightIcons}>
                            <TouchableOpacity style={styles.circleBtn}>
                                <Ionicons name="share-social-outline" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.circleBtn}
                                onPress={handleToggleFavorite}
                                disabled={isTogglingFavorite}
                            >
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isFavorite ? "#EF4444" : COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Centered Video Tour Button */}
                    {(property.images?.length > 5) && (
                        <View style={styles.videoTourContainer}>
                            <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                                <Ionicons name="play" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <Text style={styles.videoText}>VIDEO TOUR</Text>
                        </View>
                    )}

                    {/* Bottom Hero Info */}
                    <View style={styles.heroContent}>
                        <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.matchBadge}
                        >
                            <Ionicons name="sparkles" size={12} color={COLORS.white} />
                            <Text style={styles.matchText}>{property.match}</Text>
                        </LinearGradient>

                        <Text style={styles.propertyTitle}>{property.title}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={16} color={COLORS.white} />
                            <Text style={styles.locationText}>{property.address}</Text>
                        </View>
                    </View>
                </View>

                {/* MAIN CONTENT CARD */}
                <View style={styles.detailsCard}>
                    {/* Drag Handle */}
                    <View style={styles.dragHandle} />

                    <View style={styles.priceSection}>
                        <View>
                            <Text style={styles.priceLabel}>MONTHLY RENT</Text>
                            <Text style={styles.priceValue}>{property.price}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Property Highlights */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Property Highlights</Text>
                            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
                        </View>
                        <Text style={styles.sectionSubtitle}>Key features & amenities</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightScroll}>
                            <View style={styles.highlightCard}>
                                <View style={styles.highlightIconBg}>
                                    <Ionicons name="bed" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.highlightValue}>{property.bedrooms || property.bhk || 0}</Text>
                                <Text style={styles.highlightLabel}>BEDROOMS</Text>
                            </View>

                            <View style={styles.highlightCard}>
                                <View style={styles.highlightIconBg}>
                                    <Ionicons name="water" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.highlightValue}>{property.bathrooms || 0}</Text>
                                <Text style={styles.highlightLabel}>BATHROOMS</Text>
                            </View>

                            <View style={styles.highlightCard}>
                                <View style={styles.highlightIconBg}>
                                    <Ionicons name="resize" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.highlightValue} numberOfLines={1}>{property.size || property.sqft || 'N/A'}</Text>
                                <Text style={styles.highlightLabel}>AREA/SIZE</Text>
                            </View>

                            <View style={styles.highlightCard}>
                                <View style={styles.highlightIconBg}>
                                    <Ionicons name="briefcase" size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.highlightValue} numberOfLines={1}>{property.furnishing || 'N/A'}</Text>
                                <Text style={styles.highlightLabel}>FURNISHING</Text>
                            </View>

                            {property.listing_type === 'Rent' && (
                                <View style={styles.highlightCard}>
                                    <View style={styles.highlightIconBg}>
                                        <Ionicons name="wallet" size={20} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.highlightValue} numberOfLines={1}>{property.deposit || 'N/A'}</Text>
                                    <Text style={styles.highlightLabel}>DEPOSIT</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About this home</Text>
                        <Text
                            style={styles.descriptionText}
                            numberOfLines={showFullDescription ? undefined : 4}
                        >
                            {property.description}
                        </Text>
                        <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                            <Text style={styles.readMore}>
                                {showFullDescription ? "Read less" : "Read more"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Location Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Location</Text>
                            <TouchableOpacity onPress={handleGetDirections} style={styles.getDirectionsBtn}>
                                <Ionicons name="navigate-circle" size={18} color={COLORS.primary} />
                                <Text style={styles.getDirectionsText}>Get Directions</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.mapCard} activeOpacity={0.9} onPress={handleGetDirections}>
                            <Image
                                source={{
                                    uri: property.latitude && property.longitude ?
                                        `https://maps.googleapis.com/maps/api/staticmap?center=${property.latitude},${property.longitude}&zoom=16&size=600x300&markers=color:red%7C${property.latitude},${property.longitude}&key=${GOOGLE_PLACES_API_KEY}` :
                                        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80'
                                }}
                                style={styles.mapImage}
                            />
                            <View style={styles.mapOverlay}>
                                <View style={styles.mapPin}>
                                    <Ionicons name="location" size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.mapTapHint}>
                                    <Text style={styles.mapTapHintText}>Tap to open Maps</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Owner Section */}
                    <View style={styles.ownerCard}>
                        <View style={styles.ownerHeader}>
                            {/* <Image source={property.owner.image} style={styles.ownerAvatar} /> */}
                            <View style={styles.ownerAvatar}>
                                <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: 'bold' }}>
                                    {property.owner.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.ownerName}>{property.owner.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={10} color="#B45309" />
                                        <Text style={styles.ratingText}>{property.owner.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.ownerRole}>PROPERTY OWNER</Text>
                                <Text style={styles.reviewCount}>{property.owner.reviews} Reviews</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.chatOwnerBtn}
                            onPress={() => router.push({
                                pathname: '/chat/[id]',
                                params: {
                                    id: idString,
                                    otherUserId: property.owner?.id,
                                    otherUserName: property.owner?.name
                                }
                            })}
                        >
                            <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.white} />
                            <Text style={styles.chatOwnerText}>Chat with Owner</Text>
                        </TouchableOpacity>

                        <View style={styles.replyStatus}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Typically replies within {property.owner.responseTime}</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Sticky Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.requestTourBtn} onPress={() => setIsTourModalVisible(true)}>
                    <Text style={styles.requestTourText}>Request Tour</Text>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionCircleBtn, { backgroundColor: '#DCFCE7' }]}
                    onPress={handleCallRequest}
                    disabled={isCalling}
                >
                    <Ionicons name="call" size={20} color={COLORS.success} />
                    <Text style={[styles.actionLabel, { color: COLORS.success }]}>
                        {isCalling ? '...' : callStatus === 'accepted' ? 'CONTACT' : callStatus === 'pending' ? 'PENDING' : 'CALL'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* TOUR REQUEST CHAT BOX MODAL */}
            <Modal
                visible={isTourModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsTourModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setIsTourModalVisible(false)} />
                    <View style={styles.chatContainer}>
                        {/* Chat Header */}
                        <View style={styles.chatHeader}>
                            <View style={styles.ownerInfoSmall}>
                                {/* <Image source={property.owner.image} style={styles.ownerAvatarSmall} /> */}
                                <View style={styles.ownerAvatarSmall}>
                                    <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: 'bold' }}>
                                        {property.owner.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.ownerNameSmall}>{property.owner.name}</Text>
                                    <View style={styles.onlineStatusRow}>
                                        <View style={styles.onlineDot} />
                                        <Text style={styles.onlineText}>Online</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setIsTourModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
                            {/* System Message */}
                            <View style={styles.messageBubbleSystem}>
                                <Text style={styles.systemText}>You are requesting a tour for:</Text>
                                <Text style={styles.systemPropertyTitle}>{property.title}</Text>
                            </View>

                            {/* User Initial Message */}
                            <View style={styles.messageBubbleUser}>
                                <Text style={styles.userMessageText}>Hello! I'd like to schedule a tour of this property. 🏠</Text>
                            </View>

                            {/* Step 1: Date */}
                            <View style={styles.stepBubble}>
                                <Text style={styles.stepTitle}>STEP 1: Pick a Date</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chatDateSelector}>
                                    {availableDays.map((day, index) => (
                                        <TouchableOpacity
                                            key={day.id}
                                            style={[
                                                styles.chatDateItem,
                                                selectedDate === index && styles.chatDateItemActive
                                            ]}
                                            onPress={() => setSelectedDate(index)}
                                        >
                                            <Text style={[styles.chatDateDay, selectedDate === index && styles.chatDateTextActive]}>{day.dayName}</Text>
                                            <Text style={[styles.chatDateNum, selectedDate === index && styles.chatDateTextActive]}>{day.dayNum}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Step 2: Time */}
                            <View style={styles.stepBubble}>
                                <Text style={styles.stepTitle}>STEP 2: What time works best?</Text>
                                <View style={styles.chatInputWrapper}>
                                    <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
                                    <TextInput
                                        style={styles.chatTextInput}
                                        placeholder="e.g. 10:00 AM or Afternoon"
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={userTimeInput}
                                        onChangeText={setUserTimeInput}
                                    />
                                </View>
                            </View>

                            {/* Step 3: Message */}
                            <View style={styles.stepBubble}>
                                <Text style={styles.stepTitle}>STEP 3: Any specific questions? (Optional)</Text>
                                <TextInput
                                    style={[styles.chatTextInput, styles.chatMessageInput]}
                                    placeholder="Type your message here..."
                                    placeholderTextColor={COLORS.textSecondary}
                                    multiline
                                    value={userMessage}
                                    onChangeText={setUserMessage}
                                />
                            </View>
                        </ScrollView>

                        {/* Send Action */}
                        <View style={styles.chatFooter}>
                            <TouchableOpacity
                                style={[styles.sendTourBtn, (!userTimeInput.trim() || isRequesting) && styles.btnDisabled]}
                                onPress={handleConfirmTour}
                                disabled={isRequesting || !userTimeInput.trim()}
                            >
                                <Text style={styles.sendTourBtnText}>
                                    {isRequesting ? 'Sending...' : 'Send Tour Request'}
                                </Text>
                                {!isRequesting && <Ionicons name="paper-plane" size={18} color={COLORS.white} />}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    heroContainer: {
        height: height * 0.45,
        width: width,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    headerBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    videoTourContainer: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 5,
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    videoText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '700',
        marginTop: 8,
        letterSpacing: 1,
    },
    heroContent: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    matchBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
        gap: 4,
    },
    matchText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    propertyTitle: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    detailsCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingTop: 12,
        paddingHorizontal: 20,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    priceLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    priceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    breakdownBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
    },
    breakdownText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 16,
    },
    highlightScroll: {
        flexDirection: 'row',
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    highlightCard: {
        width: 110,
        padding: 16,
        backgroundColor: COLORS.surfaceHighlight,
        borderRadius: 20,
        marginRight: 12,
        alignItems: 'center',
    },
    highlightIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    highlightValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    highlightLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    readMore: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 15,
    },
    mapCard: {
        borderRadius: 24,
        height: 200,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPin: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 12,
    },
    exploreBtn: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    exploreText: {
        color: COLORS.textPrimary,
        fontSize: 13,
        fontWeight: '600',
    },
    ownerCard: {
        backgroundColor: COLORS.surfaceHighlight,
        borderRadius: 24,
        padding: 20,
        marginTop: 8,
    },
    ownerHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    ownerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary, // Changed from #E2E8F0 to primary
        justifyContent: 'center',        // Added for text centering
        alignItems: 'center',            // Added for text centering
    },
    ownerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#B45309',
    },
    ownerRole: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
        marginTop: 2,
    },
    reviewCount: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '500',
        marginTop: 2,
    },
    chatOwnerBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    chatOwnerText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    replyStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
    },
    statusText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 34,
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    requestTourBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    requestTourText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionCircleBtn: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 2,
    },
    // Modal & Base Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    btnDisabled: {
        opacity: 0.5,
    },
    // Chat Box Redesign Styles
    chatContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: height * 0.85,
        width: '100%',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    ownerInfoSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ownerAvatarSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary, // Added background
        justifyContent: 'center',        // Added for text centering
        alignItems: 'center',            // Added for text centering
    },
    ownerNameSmall: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    onlineStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
    },
    onlineText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    chatMessages: {
        flex: 1,
        padding: 20,
    },
    messageBubbleSystem: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
        alignSelf: 'center',
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    systemText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    systemPropertyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 4,
    },
    messageBubbleUser: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 20,
        borderBottomRightRadius: 4,
        alignSelf: 'flex-end',
        marginBottom: 24,
        maxWidth: '85%',
    },
    userMessageText: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 20,
    },
    stepBubble: {
        backgroundColor: '#F1F5F9',
        padding: 16,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 20,
        width: '90%',
    },
    stepTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    chatDateSelector: {
        flexDirection: 'row',
    },
    chatDateItem: {
        width: 50,
        height: 60,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    chatDateItemActive: {
        backgroundColor: COLORS.primary,
    },
    chatDateDay: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    chatDateNum: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    chatDateTextActive: {
        color: COLORS.white,
    },
    chatInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        gap: 8,
    },
    chatTextInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    chatMessageInput: {
        height: 80,
        paddingTop: 12,
        textAlignVertical: 'top',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    chatFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    sendTourBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    sendTourBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    getDirectionsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    getDirectionsText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },
    mapTapHint: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 8,
    },
    mapTapHintText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '600',
    }
});



