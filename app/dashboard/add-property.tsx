import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, LAYOUT, SPACING } from "../../src/constants/theme";
import { addProperty, getProperty, updateProperty } from "../../src/services/service";

// Replace with your Google Places API Key
const GOOGLE_PLACES_API_KEY = "AIzaSyDw84Qp9YXjxqy2m6ECrC-Qa4_yiTyiQ6s";

const PROPERTY_TYPES = [
  { id: "house", label: "Independent House", sub: "Standalone property" },
  { id: "apartment", label: "Apartment", sub: "Flat in a building" },
  { id: "villa", label: "Villa", sub: "Premium gated" },
  { id: "plot", label: "Plot / Land", sub: "Open area" },
];

const LISTING_TYPES = ["Sell", "Rent", "PG/Co-living"];

const FURNISHING_TYPES = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];

interface PlacePrediction {
  placeId: string;
  text: {
    text: string;
  };
  structuredFormat: {
    mainText: {
      text: string;
    };
    secondaryText: {
      text: string;
    };
  };
}

interface LocationCoords {
  lat: number;
  lng: number;
}

export default function AddPropertyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditMode = !!id;

  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [listingTypes, setListingTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [bhk, setBhk] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");

  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [locationCoords, setLocationCoords] = useState<LocationCoords | null>(null);
  const [mapUrl, setMapUrl] = useState("");

  const [showImageOptions, setShowImageOptions] = useState(false);

  const [errors, setErrors] = useState({
    propertyTitle: "",
    listingTypes: "",
    propertyTypes: "",
    address: "",
    bhk: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    rentPrice: "",
    price: "",
    deposit: "",
    furnishing: "",
    images: "",
  });

  const toggleListingType = (type: string) => {
    setListingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    if (errors.listingTypes) {
      setErrors((prev) => ({ ...prev, listingTypes: "" }));
    }
  };

  const togglePropertyType = (type: string) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    if (errors.propertyTypes) {
      setErrors((prev) => ({ ...prev, propertyTypes: "" }));
    }
  };

  const hasResidentialType = propertyTypes.some((t) =>
    ["house", "apartment", "villa"].includes(t)
  );

  const hasPlotType = propertyTypes.includes("plot");
  const hasNonPlotType = propertyTypes.some((t) => t !== "plot");
  const hasRentListing = listingTypes.includes("Rent") || listingTypes.includes("PG/Co-living");
  const hasSellingListing = listingTypes.includes('Sell');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (address.length > 2) {
        searchPlaces(address);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  // ---------- FETCH PROPERTY FOR EDIT MODE ----------
  useEffect(() => {
    if (isEditMode) {
      fetchPropertyForEdit();
    }
  }, [id]);

  const fetchPropertyForEdit = async () => {
    try {
      setLoading(true);
      const data = await getProperty(id as string);
      if (data) {
        setPropertyTitle(data.title || "");
        setPropertyDescription(data.description || "");
        setListingTypes(data.listing_type ? [data.listing_type] : []);
        setPropertyTypes(data.property_type ? [data.property_type] : []);
        setAddress(data.address || "");
        setBhk(data.bhk ? data.bhk.toString() : "");
        setBedrooms(data.bedrooms ? data.bedrooms.toString() : "");
        setBathrooms(data.bathrooms ? data.bathrooms.toString() : "");
        setSqft(data.sqft ? data.sqft.toString() : "");
        setRentPrice(data.rent_price ? data.rent_price.toString() : "");
        setDeposit(data.deposit ? data.deposit.toString() : "");
        setFurnishing(data.furnishing || "");
        setPrice(data.price ? data.price.toString() : "");

        if (data.latitude && data.longitude) {
          const coords = { lat: data.latitude, lng: data.longitude };
          setLocationCoords(coords);
          const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=15&size=600x300&markers=color:red%7C${coords.lat},${coords.lng}&key=${GOOGLE_PLACES_API_KEY}`;
          setMapUrl(staticMapUrl);
        }

        if (data.images && Array.isArray(data.images)) {
          setImages(data.images.map((img: any) => img.image_url));
        }
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch property details");
    } finally {
      setLoading(false);
    }
  };

  const searchPlaces = async (input: string) => {
    try {
      setSearchingAddress(true);
      const response = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          },
          body: JSON.stringify({
            input: input,
            locationBias: {
              circle: {
                center: {
                  latitude: 11.0168,
                  longitude: 76.9558,
                },
                radius: 50000.0,
              },
            },
          }),
        }
      );
      const data = await response.json();
      console.log("Autocomplete API (New) Response:", data);

      if (data.suggestions) {
        // Map New API suggestions to our internal Prediction format
        const formattedPredictions = data.suggestions.map((s: any) => s.placePrediction);
        setPredictions(formattedPredictions);
        setShowPredictions(true);
      } else {
        console.log("No suggestions found or error:", data.error || data.status);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setSearchingAddress(false);
    }
  };

  const selectPlace = async (prediction: PlacePrediction) => {
    setAddress(prediction.text.text);
    setShowPredictions(false);
    setPredictions([]);

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${prediction.placeId}?fields=location&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      console.log("Place Details (New) Response:", data);

      if (data.location) {
        const coords = {
          lat: data.location.latitude,
          lng: data.location.longitude,
        };
        console.log("Selected Location Coords:", coords);
        setLocationCoords(coords);

        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=15&size=600x300&markers=color:red%7C${coords.lat},${coords.lng}&key=${GOOGLE_PLACES_API_KEY}`;
        setMapUrl(staticMapUrl);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }

    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const requestCameraPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to take photos."
        );
        return false;
      }
    }
    return true;
  };

  const requestGalleryPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images."
        );
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newImage = result.assets[0].uri;
        const totalImages = images.length + 1;

        if (totalImages > 10) {
          Alert.alert("Limit Exceeded", "You can upload maximum 10 images");
          return;
        }

        setImages((prev) => [...prev, newImage]);
        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: "" }));
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickImagesFromGallery = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestGalleryPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        const totalImages = images.length + newImages.length;

        if (totalImages > 10) {
          Alert.alert("Limit Exceeded", "You can upload maximum 10 images");
          return;
        }

        setImages((prev) => [...prev, ...newImages]);
        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: "" }));
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {
      propertyTitle: "",
      listingTypes: "",
      propertyTypes: "",
      address: "",
      bhk: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      rentPrice: "",
      price: "",
      deposit: "",
      furnishing: "",
      images: "",
    };

    let isValid = true;

    if (!propertyTitle.trim()) {
      newErrors.propertyTitle = "Property title is required";
      isValid = false;
    } else if (propertyTitle.trim().length < 5) {
      newErrors.propertyTitle = "Title must be at least 5 characters";
      isValid = false;
    } else if (propertyTitle.trim().length > 100) {
      newErrors.propertyTitle = "Title must not exceed 100 characters";
      isValid = false;
    }

    if (listingTypes.length === 0) {
      newErrors.listingTypes = "Please select at least one listing type";
      isValid = false;
    }

    if (propertyTypes.length === 0) {
      newErrors.propertyTypes = "Please select at least one property type";
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = "Property address is required";
      isValid = false;
    } else if (address.trim().length < 10) {
      newErrors.address = "Please enter a complete address (min 10 characters)";
      isValid = false;
    }

    if (hasResidentialType) {
      if (!bhk.trim()) {
        newErrors.bhk = "BHK is required for residential properties";
        isValid = false;
      } else {
        const bhkNum = Number(bhk);
        if (isNaN(bhkNum) || bhkNum <= 0) {
          newErrors.bhk = "BHK must be a positive number";
          isValid = false;
        } else if (bhkNum > 20) {
          newErrors.bhk = "BHK seems unusually high (max 20)";
          isValid = false;
        } else if (!Number.isInteger(bhkNum)) {
          newErrors.bhk = "BHK must be a whole number";
          isValid = false;
        }
      }
    }

    if (hasNonPlotType) {
      if (!bedrooms.trim()) {
        newErrors.bedrooms = "Number of bedrooms is required";
        isValid = false;
      } else {
        const bedroomsNum = Number(bedrooms);
        if (isNaN(bedroomsNum) || bedroomsNum < 0) {
          newErrors.bedrooms = "Bedrooms must be a positive number or 0";
          isValid = false;
        } else if (bedroomsNum > 20) {
          newErrors.bedrooms = "Bedrooms seems unusually high (max 20)";
          isValid = false;
        } else if (!Number.isInteger(bedroomsNum)) {
          newErrors.bedrooms = "Bedrooms must be a whole number";
          isValid = false;
        }
      }
    }

    if (hasNonPlotType) {
      if (!bathrooms.trim()) {
        newErrors.bathrooms = "Number of bathrooms is required";
        isValid = false;
      } else {
        const bathroomsNum = Number(bathrooms);
        if (isNaN(bathroomsNum) || bathroomsNum <= 0) {
          newErrors.bathrooms = "Bathrooms must be a positive number";
          isValid = false;
        } else if (bathroomsNum > 20) {
          newErrors.bathrooms = "Bathrooms seems unusually high (max 20)";
          isValid = false;
        }
      }
    }

    if (hasResidentialType || hasPlotType) {
      if (!sqft.trim()) {
        newErrors.sqft = "Area is required";
        isValid = false;
      } else {
        const sqftNum = Number(sqft);
        if (isNaN(sqftNum) || sqftNum <= 0) {
          newErrors.sqft = "Area must be a positive number";
          isValid = false;
        } else if (sqftNum < 100) {
          newErrors.sqft = "Area seems too small (min 100 sqft)";
          isValid = false;
        } else if (sqftNum > 1000000) {
          newErrors.sqft = "Area seems too large (max 1,000,000 sqft)";
          isValid = false;
        }
      }
    }

    if (hasRentListing && hasNonPlotType) {
      if (!rentPrice.trim()) {
        newErrors.rentPrice = "Rent price is required for rental properties";
        isValid = false;
      } else {
        const rentNum = Number(rentPrice);
        if (isNaN(rentNum) || rentNum <= 0) {
          newErrors.rentPrice = "Rent must be a positive number";
          isValid = false;
        } else if (rentNum < 1000) {
          newErrors.rentPrice = "Rent seems too low (min ₹1000)";
          isValid = false;
        } else if (rentNum > 10000000) {
          newErrors.rentPrice = "Rent seems too high (max ₹1,00,00,000)";
          isValid = false;
        }
      }
    }

    if (hasSellingListing) {
      if (!price.trim()) {
        newErrors.price = "Price is required for selling properties";
        isValid = false;
      } else {
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) {
          newErrors.price = "Price must be a positive number";
          isValid = false;
        }
      }
    }

    if (hasRentListing && hasNonPlotType) {
      if (!deposit.trim()) {
        newErrors.deposit = "Deposit amount is required for rental properties";
        isValid = false;
      } else {
        const depositNum = Number(deposit);
        if (isNaN(depositNum) || depositNum < 0) {
          newErrors.deposit = "Deposit must be a positive number or 0";
          isValid = false;
        } else if (depositNum > 100000000) {
          newErrors.deposit = "Deposit seems too high (max ₹10,00,00,000)";
          isValid = false;
        }
      }
    }

    if (hasNonPlotType) {
      if (!furnishing) {
        newErrors.furnishing = "Please select furnishing status";
        isValid = false;
      }
    }

    if (images.length === 0) {
      newErrors.images = "Please add at least one property image";
      isValid = false;
    } else if (images.length > 10) {
      newErrors.images = "Maximum 10 images allowed";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors in the form before submitting"
      );
      return;
    }

    const payload = {
      title: propertyTitle.trim(),
      listingTypes,
      propertyTypes,
      address: address.trim(),
      location: locationCoords,
      bhk: hasResidentialType ? Number(bhk) : null,
      bedrooms: hasNonPlotType ? Number(bedrooms) : null,
      bathrooms: hasNonPlotType ? Number(bathrooms) : null,
      sqft: (hasResidentialType || hasPlotType) ? Number(sqft) : null,
      rentPrice: (hasRentListing && hasNonPlotType) ? Number(rentPrice) : null,
      deposit: (hasRentListing && hasNonPlotType) ? Number(deposit) : null,
      furnishing: hasNonPlotType ? furnishing : null,
      description: propertyDescription.trim(),
      images: images,
      price: hasSellingListing ? Number(price) : null,
    };

    console.log("Submitting Property Payload:", JSON.stringify(payload, null, 2));

    try {
      setLoading(true);
      if (isEditMode) {
        await updateProperty(id as string, payload);
        Alert.alert("Success", "Property updated successfully", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        await addProperty(payload);
        Alert.alert("Success", "Property added successfully", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? "Edit Property" : "List Property"}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* BASIC INFO */}
        <Text style={styles.sectionTitle}>Basic Information</Text>

        {/* TITLE */}
        <Text style={styles.label}>
          PROPERTY TITLE <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.textInput, errors.propertyTitle && styles.inputError]}
          placeholder="3BHK Apartment in Gandhipuram"
          value={propertyTitle}
          onChangeText={(text) => {
            setPropertyTitle(text);
            if (errors.propertyTitle) {
              setErrors((prev) => ({ ...prev, propertyTitle: "" }));
            }
          }}
          maxLength={100}
        />
        {errors.propertyTitle && (
          <Text style={styles.errorText}>{errors.propertyTitle}</Text>
        )}

        {/* DESCRIPTION */}
        <Text style={styles.label}>
          PROPERTY DESCRIPTION
        </Text>
        <TextInput
          style={[styles.textInput, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
          placeholder="Detailed description of your property, surroundings, and rules..."
          value={propertyDescription}
          onChangeText={setPropertyDescription}
          multiline
          numberOfLines={4}
        />

        {/* LISTING TYPE */}
        <Text style={styles.label}>
          I WANT TO <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.segmentContainer}>
          {LISTING_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.segmentBtn,
                listingTypes.includes(type) && styles.segmentBtnActive,
              ]}
              onPress={() => toggleListingType(type)}
            >
              <Text
                style={[
                  styles.segmentText,
                  listingTypes.includes(type) && styles.segmentTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.listingTypes && (
          <Text style={styles.errorText}>{errors.listingTypes}</Text>
        )}

        {/* PROPERTY TYPE */}
        <Text style={styles.label}>
          PROPERTY TYPE <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.gridContainer}>
          {PROPERTY_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                propertyTypes.includes(type.id) && styles.typeCardActive,
              ]}
              onPress={() => togglePropertyType(type.id)}
            >
              {propertyTypes.includes(type.id) && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.primary}
                  style={{ position: "absolute", top: 8, right: 8 }}
                />
              )}
              <Text style={styles.typeLabel}>{type.label}</Text>
              <Text style={styles.typeSub}>{type.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.propertyTypes && (
          <Text style={styles.errorText}>{errors.propertyTypes}</Text>
        )}

        {/* PROPERTY DETAILS SECTION */}
        {(hasResidentialType || hasNonPlotType) && (
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Property Details</Text>
        )}

        {/* CONDITIONAL INPUTS */}
        {hasResidentialType && (
          <>
            <Text style={styles.label}>
              BHK <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.bhk && styles.inputError]}
              placeholder="Eg: 2"
              keyboardType="numeric"
              value={bhk}
              onChangeText={(text) => {
                setBhk(text);
                if (errors.bhk) {
                  setErrors((prev) => ({ ...prev, bhk: "" }));
                }
              }}
              maxLength={2}
            />
            {errors.bhk && <Text style={styles.errorText}>{errors.bhk}</Text>}
          </>
        )}

        {hasNonPlotType && (
          <>
            <Text style={styles.label}>
              BEDROOMS <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.bedrooms && styles.inputError]}
              placeholder="Eg: 3"
              keyboardType="numeric"
              value={bedrooms}
              onChangeText={(text) => {
                setBedrooms(text);
                if (errors.bedrooms) {
                  setErrors((prev) => ({ ...prev, bedrooms: "" }));
                }
              }}
              maxLength={2}
            />
            {errors.bedrooms && <Text style={styles.errorText}>{errors.bedrooms}</Text>}

            <Text style={styles.label}>
              BATHROOMS <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.bathrooms && styles.inputError]}
              placeholder="Eg: 2"
              keyboardType="numeric"
              value={bathrooms}
              onChangeText={(text) => {
                setBathrooms(text);
                if (errors.bathrooms) {
                  setErrors((prev) => ({ ...prev, bathrooms: "" }));
                }
              }}
              maxLength={2}
            />
            {errors.bathrooms && <Text style={styles.errorText}>{errors.bathrooms}</Text>}
          </>
        )}

        {(hasResidentialType || hasPlotType) && (
          <>
            <Text style={styles.label}>
              BUILT-UP AREA (SQFT) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.sqft && styles.inputError]}
              placeholder="Eg: 1200"
              keyboardType="numeric"
              value={sqft}
              onChangeText={(text) => {
                setSqft(text);
                if (errors.sqft) {
                  setErrors((prev) => ({ ...prev, sqft: "" }));
                }
              }}
              maxLength={7}
            />
            {errors.sqft && <Text style={styles.errorText}>{errors.sqft}</Text>}
          </>
        )}

        {hasNonPlotType && (
          <>
            <Text style={styles.label}>
              FURNISHING STATUS <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.segmentContainer}>
              {FURNISHING_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.segmentBtn,
                    furnishing === type && styles.segmentBtnActive,
                  ]}
                  onPress={() => {
                    setFurnishing(type);
                    if (errors.furnishing) {
                      setErrors((prev) => ({ ...prev, furnishing: "" }));
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      furnishing === type && styles.segmentTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.furnishing && (
              <Text style={styles.errorText}>{errors.furnishing}</Text>
            )}
          </>
        )}

        {/* PRICING SECTION */}
        {hasSellingListing && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Pricing Details</Text>

            <Text style={styles.label}>
              PRICE (₹) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.price && styles.inputError]}
              placeholder="Eg: 5000000"
              keyboardType="numeric"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                if (errors.price) {
                  setErrors((prev) => ({ ...prev, price: "" }));
                }
              }}
              maxLength={10}
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </>
        )}

        {hasRentListing && hasNonPlotType && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Pricing Details</Text>

            <Text style={styles.label}>
              MONTHLY RENT (₹) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.rentPrice && styles.inputError]}
              placeholder="Eg: 15000"
              keyboardType="numeric"
              value={rentPrice}
              onChangeText={(text) => {
                setRentPrice(text);
                if (errors.rentPrice) {
                  setErrors((prev) => ({ ...prev, rentPrice: "" }));
                }
              }}
              maxLength={8}
            />
            {errors.rentPrice && <Text style={styles.errorText}>{errors.rentPrice}</Text>}

            <Text style={styles.label}>
              SECURITY DEPOSIT (₹) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.deposit && styles.inputError]}
              placeholder="Eg: 30000"
              keyboardType="numeric"
              value={deposit}
              onChangeText={(text) => {
                setDeposit(text);
                if (errors.deposit) {
                  setErrors((prev) => ({ ...prev, deposit: "" }));
                }
              }}
              maxLength={9}
            />
            {errors.deposit && <Text style={styles.errorText}>{errors.deposit}</Text>}
          </>
        )}

        {/* LOCATION SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Location</Text>

        {/* ADDRESS WITH AUTOCOMPLETE */}
        <Text style={styles.label}>
          PROPERTY ADDRESS <Text style={styles.required}>*</Text>
        </Text>
        <View style={{ position: 'relative', zIndex: 10 }}>
          <View style={styles.addressInputContainer}>
            <TextInput
              style={[styles.textInput, errors.address && styles.inputError, { paddingRight: 40 }]}
              placeholder="Search location in Coimbatore"
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                if (errors.address) {
                  setErrors((prev) => ({ ...prev, address: "" }));
                }
              }}
            />
            {searchingAddress && (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={styles.searchingIndicator}
              />
            )}
          </View>

          {showPredictions && predictions.length > 0 && (
            <View style={styles.predictionsContainer}>
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.placeId}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.predictionItem}
                    onPress={() => selectPlace(item)}
                  >
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.predictionMain}>
                        {item.structuredFormat.mainText.text}
                      </Text>
                      <Text style={styles.predictionSecondary}>
                        {item.structuredFormat.secondaryText.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}

        {/* MAP PREVIEW */}
        {mapUrl ? (
          <RNImage
            source={{ uri: mapUrl }}
            style={styles.map}
            resizeMode="cover"
          />
        ) : (
          <RNImage
            source={{
              uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b",
            }}
            style={styles.map}
          />
        )}

        {/* IMAGES SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Property Images</Text>

        <Text style={styles.label}>
          PHOTOS <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.subLabel}>Add up to 10 images of your property</Text>

        {/* Image Grid */}
        {images.length > 0 && (
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <RNImage source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Image Button */}
        {images.length < 10 && (
          <TouchableOpacity
            style={[styles.addImageBtn, errors.images && styles.addImageBtnError]}
            onPress={() => setShowImageOptions(true)}
          >
            <Ionicons name="camera-outline" size={32} color={COLORS.primary} />
            <Text style={styles.addImageText}>
              {images.length === 0 ? "Add Photos" : `Add More (${images.length}/10)`}
            </Text>
            <Text style={styles.addImageSubtext}>
              Take photo or select from gallery
            </Text>
          </TouchableOpacity>
        )}

        {errors.images && (
          <Text style={styles.errorText}>{errors.images}</Text>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? "Saving..." : "Save & Proceed"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* IMAGE OPTIONS MODAL */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Property Photo</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color={COLORS.primary} />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickImagesFromGallery}
            >
              <Ionicons name="images" size={24} color={COLORS.primary} />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerTitle: { fontWeight: "bold", fontSize: 16 },
  scrollContent: { padding: SPACING.l },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 16,
    color: "#64748B",
  },
  required: {
    color: "#EF4444",
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.white,
    ...LAYOUT.shadow,
  },
  segmentText: { color: COLORS.textSecondary, fontSize: 12 },
  segmentTextActive: { color: COLORS.primary, fontWeight: "bold" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  typeCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.primary,
  },
  typeLabel: { fontWeight: "bold", marginBottom: 4, fontSize: 13 },
  typeSub: { fontSize: 11, color: COLORS.textSecondary },
  subLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  // Address Autocomplete Styles
  addressInputContainer: {
    position: 'relative',
  },
  searchingIndicator: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  predictionsContainer: {
    position: 'absolute',
    top: 55, // Positioned below the input
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 0,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    maxHeight: 250,
    zIndex: 1000,
    ...LAYOUT.shadow,
    elevation: 8, // Higher elevation to be on top
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  predictionMain: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  predictionSecondary: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  imageContainer: {
    width: "31%",
    aspectRatio: 1,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addImageBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    marginBottom: 8,
  },
  addImageBtnError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  addImageText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  addImageSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  map: {
    height: 150,
    borderRadius: 16,
    marginTop: 12,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
    color: COLORS.textPrimary,
  },
  modalCancelBtn: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  // Footer Styles
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.l,
    flexDirection: "row",
    gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  backBtn: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnText: {
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});