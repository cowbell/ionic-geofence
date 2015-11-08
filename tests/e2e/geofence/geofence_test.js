import protractor from "protractor";

const EC = protractor.ExpectedConditions;

describe("Geofence test", () => {
    function addGeofence(notificationText) {
        const addGeofenceButton = element(by.css(".ion-plus"));
        const saveGeofenceButton = element(by.css(".ion-checkmark"));
        const notificationTextInput = element(by.model("geofence.notification.text"));

        addGeofenceButton.click();
        //workaround protractor doesn't wait for html geolocation API to resolve
        browser.wait(EC.presenceOf(notificationTextInput), 5000);
        notificationTextInput.sendKeys(notificationText);
        saveGeofenceButton.click();
    }

    beforeAll(function() {
        wdBrowser.setGeoLocation(50, 50, 100);
    });

    it("should add geofence", (done) => {
        const geofenceList = element.all(by.repeater("geofence in geofences"));
        addGeofence("Tested geofence region");

        expect(geofenceList.count()).toBe(1);
        expect(geofenceList.first().getText()).toContain("Tested geofence region");
        done();
    });

    it("should remove added geofence", (done) => {
        const removeButton = element(by.css(".ion-trash-b"));
        const geofenceList = element.all(by.repeater("geofence in geofences"));

        expect(geofenceList.count()).toBe(1);
        removeButton.click();
        expect(geofenceList.count()).toBe(0);
        done();
    });

    it("should remove all added geofences", (done) => {
        const moreOptionsButton = element(by.css(".ion-more"));
        const removeAllButton = element(by.buttonText("Delete all geofences"));
        const geofenceList = element.all(by.repeater("geofence in geofences"));

        addGeofence("First geofence");
        addGeofence("Second geofences");

        expect(geofenceList.count()).toBe(2);
        moreOptionsButton.click();
        removeAllButton.click();
        expect(geofenceList.count()).toBe(0);
        done();
    });
});
