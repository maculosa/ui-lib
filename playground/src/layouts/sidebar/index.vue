<template>
    <aside class="sidebar">
        <div class="sidebar-groups">
            <section class="sidebar-group">
                <p class="sidebar-group__title">Overview</p>
                <a class="link active" href="/procomponent/overview">
                    <p class="link-text">Overview</p>
                </a>
            </section>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 200px;
    background-color: var(--bg-color);
    padding: 48px 32px;
    overflow-y: auto;
    transform: translate(-100%);
    transition: background-color 0.2s, opacity 0.25s, transform 0.5s cubic-bezier(.19, 1, .22, 1);
}

@media screen and (min-width: 1440px) {
    .sidebar {
        padding: 48px 32px;
        width: calc(200px + 32px);
    }
}

@media screen and (min-width: 960px) {
    .sidebar {
        z-index: 99;
        top: 55px;
        transform: translate(0);
    }
}

.sidebar .sidebar-groups {
    padding: 0;
}

.sidebar .sidebar-groups .sidebar-group__title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 24px;
}

.link {
    padding: 10px 16px;
    line-height: 1.5;
    font-size: 0.9rem;
    border-radius: 8px;
}
.link.active {
    background-color: hsla(210, 100%, 63%, 0.1);
}

.link:not(.flex) {
    display: block;
}

.link-text:hover {
    color: #409eff;
}

a {
    font-weight: 500;
    text-decoration: inherit;
    color: #409eff;
}

</style>