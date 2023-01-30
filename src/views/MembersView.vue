<script setup>
	import { useSessionStore } from '@/stores/session';
	import Swal from 'sweetalert2';
	import md5 from 'md5';

	const session = useSessionStore();

	session.isValid();

	const Toast = Swal.mixin({
		toast: true,
		position: 'bottom-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	});

	let members = ref([]);
	api.get(`members?token=${session.data.token}`).then(r => {
		members.value = r
		members.value.forEach(m => {
			m.hash = md5(m.email);
			delete m.password;
		});
	});

	function deleteUser(id, event) {
		api.delete(`members/${id}?token=${session.data.token}`).then(r => {
			event.target.closest('.column').remove();
			Toast.fire({
				icon: 'success',
				text: r.message
			});
		}).catch(e => {
			Toast.fire({
				icon: 'error',
				text: e.toString()
			});
		});
	}
</script>

<template>
	<div class="section">
		<h1 class="title">Liste des membres</h1>
		<div class="columns is-multiline">
			<template v-for="member in members">
				<div class="column is-3">
					<RouterLink :to="`/members/${member.id}`" class="box">
						<div class="media">
							<div class="media-left">
								<figure class="image is-48x48">
									<img :src="`https://www.gravatar.com/avatar/${member.hash}?d=identicon`" :alt="`Avatar de ${member.fullname}`">
								</figure>
							</div>
							<div class="media-content">
								<div class="content">
									<p>
										<strong>
											<span class="icon is-small">
												<i class="fas fa-user" aria-hidden="true"></i>
											</span>
											{{ member.fullname }}
										</strong>
										<br>
										<small>
											<span class="icon is-small">
												<i class="fas fa-envelope" aria-hidden="true"></i>
											</span>
											{{ member.email }}
										</small>
									</p>
								</div>
								<nav v-if="member.id !== session.data.member.id" class="level is-mobile">
									<div class="level-left">
										<a @click.prevent="deleteUser(member.id, $event)" class=" button is-danger is-light level-item" aria-label="reply">
											<span class="icon is-small">
												<i class="fas fa-trash" aria-hidden="true"></i>
											</span>
										</a>
									</div>
								</nav>
							</div>
						</div>
					</RouterLink>
				</div>
			</template>
		</div>
	</div>
</template>