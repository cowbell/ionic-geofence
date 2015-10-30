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

    it("should add geofence", (done) => {
        const geofenceList = element.all(by.repeater("geofence in geofences"));
        addGeofence("Tested geofence region");

        expect(geofenceList.count()).toBe(1);
        expect(geofenceList.first().getText()).toContain("Tested geofence region");
        done();
    });
});
