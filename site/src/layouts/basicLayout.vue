<template>
    <div class="layout">
        <header class="layout-header">
            <div class="logo"></div>

            <nav class="nav">
                <router-link to="/">Data V</router-link>
                <router-link to="/ui">UI</router-link>
            </nav>
        </header>

        <div>
            <router-view />
        </div>
    </div>
</template>

<style>

.logo {
    width: 40px;
    height: 40px;
    background: #f0e5e5;
    border-radius: 20%;
}

.layout {
    width: 100%;
    height: 100%;
}

.layout-header {
    width: 100%;
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    a {
        color: #333;
        text-decoration: none;
        &:hover {
            color: #ff8821;
        }
    }
}
</style>