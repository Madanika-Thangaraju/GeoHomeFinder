import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
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
import { addProperty } from "../../src/services/service";

const PROPERTY_TYPES = [
  { id: "house", label: "Independent House", sub: "Standalone property" },
  { id: "apartment", label: "Apartment", sub: "Flat in a building" },
  { id: "villa", label: "Villa", sub: "Premium gated" },
  { id: "plot", label: "Plot / Land", sub: "Open area" },
];

const LISTING_TYPES = ["Sell", "Rent", "PG/Co-living"];

export default function AddPropertyScreen() {
  const router = useRouter();

  const [propertyTitle, setPropertyTitle] = useState("");
  const [listingTypes, setListingTypes] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [bhk, setBhk] = useState("");
  const [sqft, setSqft] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Field error states for inline validation
  const [errors, setErrors] = useState({
    propertyTitle: "",
    listingTypes: "",
    propertyTypes: "",
    address: "",
    bhk: "",
    sqft: "",
    images: "",
  });

  /* MULTI SELECT HANDLERS */
  const toggleListingType = (type: string) => {
    setListingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    // Clear error when user selects
    if (errors.listingTypes) {
      setErrors((prev) => ({ ...prev, listingTypes: "" }));
    }
  };

  const togglePropertyType = (type: string) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    // Clear error when user selects
    if (errors.propertyTypes) {
      setErrors((prev) => ({ ...prev, propertyTypes: "" }));
    }
  };

  /* HELPERS */
  const hasResidentialType = propertyTypes.some((t) =>
    ["house", "apartment", "villa"].includes(t)
  );

  const hasPlotType = propertyTypes.includes("plot");

  /* IMAGE PICKER */
  const requestPermissions = async () => {
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

  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  /* VALIDATION */
  const validateForm = () => {
    const newErrors = {
      propertyTitle: "",
      listingTypes: "",
      propertyTypes: "",
      address: "",
      bhk: "",
      sqft: "",
      images: "",
    };

    let isValid = true;

    // Property Title validation
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

    // Listing Types validation
    if (listingTypes.length === 0) {
      newErrors.listingTypes = "Please select at least one listing type";
      isValid = false;
    }

    // Property Types validation
    if (propertyTypes.length === 0) {
      newErrors.propertyTypes = "Please select at least one property type";
      isValid = false;
    }

    // Address validation
    if (!address.trim()) {
      newErrors.address = "Property address is required";
      isValid = false;
    } else if (address.trim().length < 10) {
      newErrors.address = "Please enter a complete address (min 10 characters)";
      isValid = false;
    }

    // BHK validation (only for residential)
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

    // Sqft validation (for residential or plot)
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

    // Images validation
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

  /* SUBMIT */
  const handleSubmit = async () => {
    // Run validation
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
      bhk: hasResidentialType ? Number(bhk) : null,
      sqft: (hasResidentialType || hasPlotType) ? Number(sqft) : null,
      images: images,
    };

    try {
      setLoading(true);
      await addProperty(payload);
      Alert.alert("Success", "Property added successfully", [
        { text: "OK", onPress: () => router.back() }
      ]);
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
        <Text style={styles.headerTitle}>List Property</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        {/* ADDRESS */}
        <Text style={styles.label}>
          PROPERTY ADDRESS <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.textInput, errors.address && styles.inputError]}
          placeholder="Search location in Coimbatore"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            if (errors.address) {
              setErrors((prev) => ({ ...prev, address: "" }));
            }
          }}
          multiline
          numberOfLines={2}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}

        {/* IMAGES */}
        <Text style={styles.label}>
          PROPERTY IMAGES <Text style={styles.required}>*</Text>
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
            onPress={pickImages}
          >
            <Ionicons name="camera-outline" size={32} color={COLORS.primary} />
            <Text style={styles.addImageText}>
              {images.length === 0 ? "Add Photos" : `Add More (${images.length}/10)`}
            </Text>
            <Text style={styles.addImageSubtext}>
              Tap to select from gallery
            </Text>
          </TouchableOpacity>
        )}

        {errors.images && (
          <Text style={styles.errorText}>{errors.images}</Text>
        )}

        {/* MAP PLACEHOLDER */}
        <RNImage
          source={{
            uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b",
          }}
          style={styles.map}
        />

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