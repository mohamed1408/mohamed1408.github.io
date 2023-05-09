let content = document.querySelector(".container")
var header = document.getElementById("header")
var customerSelect = document.getElementById("customer")
var quarterSelect = document.getElementById("quarter")
var filterConfig = {
    durationtype: "year"
}
const configFilter = () => {
    document.querySelectorAll("[id$=btn]").forEach(btn => {
        console.log(btn.id)
        if(filterConfig.durationtype == btn.id.split("-")[0]){
            btn.classList.add("active")
        } else {
            btn.classList.remove("active")
        }
    })
}
// header shadow on scroll
window.addEventListener("scroll", () => {
    console.log(this.scrollY)
    if(scrollY > 0) {
        header.classList.add("shadow")
    } else {
        header.classList.remove("shadow")
    }
})

console.log(data)
data.forEach(x => {
    let option = document.createElement("option")
    option.innerText = x.Customer
    option.value = x.Customer
    customerSelect.appendChild(option)
})

configFilter()

// new colors - bar charts #cca7fb | #7338fc