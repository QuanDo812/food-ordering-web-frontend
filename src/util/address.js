export const getAddress = (address) => {
    let addressString = "";
    if (address?.detailAddress) {
        addressString += address.detailAddress + ", ";
    }
    if (address?.ward) {
        addressString += address.ward + ", ";
    }
    if (address?.district) {
        addressString += address.district + ", ";
    }
    if (address?.province) {
        addressString += address.province;
    }
    return addressString.trim();
}