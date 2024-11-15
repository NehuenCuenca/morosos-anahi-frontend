<template>
    <button type="button" class="kebab" @click="handleClickKebabMenu">
        <i class='kebab__middle-icon bx bx-md bx-dots-vertical-rounded'></i>
        <i class='kebab__cross-icon bx bx-md bx-x'></i>

        <ul class="kebab__dropdown">
            <li class="kebab__dropdown-item kebab__dropdown-item_hover">
                <slot name="editButton"></slot>
            </li>
            <li class="kebab__dropdown-item kebab__dropdown-item_hover">
                <slot name="payOrCrossButton"></slot>
            </li>
            <li class="kebab__dropdown-item kebab__dropdown-item_hover">
                <slot name="fileButton"></slot>
            </li>
        </ul>
    </button>
</template>

<script setup>

    const handleClickKebabMenu = (event) => { 
        const kebabMenuClicked = event.currentTarget
        
        const openMenus = [...document.querySelectorAll('.kebab__dropdown_active')];
        if( openMenus.length > 0 ){
            const sameKebabMenuElement = kebabMenuClicked.querySelector('.kebab__dropdown').classList.contains('kebab__dropdown_active')
            
            if( sameKebabMenuElement ){
                toggleClassListChildren(kebabMenuClicked)
                return
            }

            for (let i = 0; i < openMenus.length; i++) {
                const openMenuParentButton = openMenus[i].parentElement
                toggleClassListChildren(openMenuParentButton)
            }
        }

        toggleClassListChildren(kebabMenuClicked)
    }

    const toggleClassListChildren = (kebabMenuElement) => { 
        const middle = kebabMenuElement.querySelector('.kebab__middle-icon');
        const cross  = kebabMenuElement.querySelector('.kebab__cross-icon');
        const dropdown = kebabMenuElement.querySelector('.kebab__dropdown');

        middle.classList.toggle('kebab__middle-icon_active');
        cross.classList.toggle('kebab__cross-icon_active');
        dropdown.classList.toggle('kebab__dropdown_active');
    }
</script>

<style scoped>
/* ORIGINAL IDEA FROM https://codepen.io/mildrenben/pen/MwezWG */
/* Kebab styling */
.kebab {
    cursor: pointer;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    padding: 0;
    /* top: 12px; */
}

.figure {
    width: 6px;
    height: 6px;
    border-radius: 5px;
    background: #00bcd4;
    margin: 3px 0;
}

.kebab__middle-icon {
    transition: all 0.25s cubic-bezier(.72,1.2,.71,.72);
    transform: scale(1);
    position: relative;
    box-shadow: 0 0.1px 0.1px 0 rgba(0, 0, 0, 0.16), 0 0.1px 0.3px 0 rgba(0, 0, 0, 0.12);
    -webkit-filter: blur(.1px);
    filter: blur(.1px);
}

.kebab__middle-icon_active {
    /* transform: scale(4.5); */
    transition: all 0.25s cubic-bezier(.32,2.04,.85,.54);
    box-shadow: 0 0.1px 0.1px 0 rgba(0, 0, 0, 0.16), 0 0.1px 0.3px 0 rgba(0, 0, 0, 0.12);
    opacity: 0;
}

.kebab__cross-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    margin-top: -1px;
    font-family: var(--display-font);
    /* color: white; */
    transition: all 0.2s cubic-bezier(.72,1.2,.71,.72);
    font-size: 22px;
    user-select: none;
}

.kebab__cross-icon_active {
    transform: translate(-50%, -50%) scale(1);
    transition: all 0.15s cubic-bezier(.32,2.04,.85,.54);
}


/* Other styling */

.kebab__dropdown {
    position: absolute;
    left: -250%;
    top: 2.5rem;
    z-index: 9;
    transition: all 0.25s ease-out;
    transform: scale(0);
    transform-origin: 100% 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 8px 0 rgba(0, 0, 0, 0.12);
    background-color: color-mix(in srgb, 20% var(--grey), 80% var(--white));
}

.kebab__dropdown_hover, .kebab__dropdown:hover {
    ul {
      transform: scale(1);
    }
}

.kebab__dropdown_active {
    transform: scale(1);
    transition: all 0.25s cubic-bezier(.5,1.8,.9,.8);
    display: flex;
    gap: 1rem;
    padding: .2rem .5rem;
    border-radius: 5px;
}

.kebab__dropdown-item {
    display: block;
    width: 100%;  
    border-radius: 2px;
    padding: .2rem;
}

.kebab__dropdown-item_hover:hover {
    background-color: var(--grey);
}

@media (width >= 768px) {}

@media (width >= 128px) {}
</style>