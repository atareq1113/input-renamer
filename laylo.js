// ==UserScript==
// @name         Input Renamer
// @version      1.4
// @description  Renames multiple input fields on example.com
// @author       Abdullah Tareq
// @match        *://example.com/*
// @grant        none
// ==/UserScript==

'use strict';

// Simple function to rename verification code fields
function renameVerificationCodeFields() {
    // Get all inputs with name="verificationCode"
    const verificationInputs = document.querySelectorAll('input[name="verificationCode"]');
    
    // If we found multiple inputs, rename them
    if (verificationInputs && verificationInputs.length > 1) {
        console.log(`Found ${verificationInputs.length} verification code input fields`);
        
        // Rename all but the first one
        for (let i = 1; i < verificationInputs.length; i++) {
            const newName = `verificationCode${i + 1}`;
            verificationInputs[i].setAttribute('name', newName);
            console.log(`Renamed input ${i + 1} to "${newName}"`);
        }
        
        console.log(`Kept first input as "verificationCode"`);
    } else if (verificationInputs.length === 1) {
        console.log(`Found only one verification code input field`);
    } else {
        console.log(`No verification code input fields found`);
    }
}

// Function to run the renaming process
function runRenamer() {
    // Run immediately
    renameVerificationCodeFields();
    
    // Set up a mutation observer to detect when new inputs might be added
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes contain our target inputs
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector('input[name="verificationCode"]') || 
                            node.nodeName === 'INPUT' && node.getAttribute('name') === 'verificationCode') {
                            console.log('Verification code input detected in DOM changes');
                            renameVerificationCodeFields();
                            return;
                        }
                    }
                }
            }
        }
    });
    
    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also run on clicks, as the verification code UI might appear after a user action
    document.addEventListener('click', () => {
        setTimeout(renameVerificationCodeFields, 500);
        setTimeout(renameVerificationCodeFields, 1500);
    });
    
    // Set an interval as a fallback
    const intervalId = setInterval(() => {
        const inputs = document.querySelectorAll('input[name="verificationCode"]');
        if (inputs.length > 1) {
            renameVerificationCodeFields();
            // If we've successfully renamed fields, we can reduce the frequency
            clearInterval(intervalId);
            setInterval(renameVerificationCodeFields, 5000); // Check less frequently after success
        }
    }, 1000);
}

// Initialize the script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runRenamer);
} else {
    runRenamer();
} 
