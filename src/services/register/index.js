export const registerNewUser = async (formData) => {

  try {
    console.log("form data",formData)
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });



    const finalData = await response.json();

    return finalData;
  } catch (e) {
    console.log("error", e);
  }
};


