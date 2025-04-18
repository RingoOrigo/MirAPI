# MirAPI
An API meant to provide helpful information about Planet Mira from Xenoblade Chronicles X.  

### A Note on API Content
MirAPI is tailored to return data relevant to the 2025 Definitive Edition release of Xenoblade Chronicles X. While most information is identical, any definitive-edition-exclusive content is not labeled as such or kept separate from standard-edition content.

# Endpoints
Below are all endpoints of MirAPI. Before each endpoint is a symbol dictating its completeness according to the following table:
| Symbol | Meaning |
| ------ | ------- |
|🟢| Complete|
|🟡| Implemented, but incomplete return data |
|🔴| Unimplemented, but planned. |
### 🟢 Get Frontier Nav sites

```http
  GET /api/sites?id={ID}
```

| Parameter | Type      | Description                |
| :-------- | :-------  | :------------------------- |
| `ID`      | `Integer` | **Optional**. Specifies a specific site ID (i.e. 101). If unspecified, returns list of all Frontier Nav sites. |

### 🟡 Get list of missions
```http
  GET /api/missions?type={Type}&name={mission-name}
```
| Parameter | Type      | Description                |
| :-------- | :-------  | :------------------------- |
| `Type`      | `String` | **Optional**. Specifies the type of mission (Basic, Story, Normal, Affinity) to be returned. If unspecified, returns list of all missions. |
| `mission-name` | `String` | **Optional**. Specifies the name of a mission in kebab-case. If unspecified, returns list of all missions. If specified with `Type`, searches missions of that type for the given name.

### 🔴 Get list of arts
```http
  GET /api/arts?name={art-name}
```
| Parameter | Type      | Description                |
| :-------- | :-------  | :------------------------- |
| `art-name`      | `String` | **Optional**. Specifies the name of an art in kebab-case. If unspecified, returns list of all arts. |

### 🔴 Get list of classes
```http
  GET /api/classes?name={class-name}
```
| Parameter | Type      | Description                |
| :-------- | :-------  | :------------------------- |
| `class-name`      | `String` | **Optional**. Specifies the name of a class in kebab-case. If unspecified, returns list of all classes. |

### 🔴 Get list of skills
```http
  GET /api/skills?name={skill-name}
```
| Parameter | Type      | Description                |
| :-------- | :-------  | :------------------------- |
| `skill-name`      | `String` | **Optional**. Specifies the name of a skill in kebab-case. If unspecified, returns list of all skills. |

### 🔴 Get list of skells
```http
  GET /api/skells?name={skell-name}
```
| Parameter | Type      | Description                |
| :-------- | :-------  | :------------------------- |
| `skell-name`      | `String` | **Optional**. Specifies the name of a skell in kebab-case. If unspecified, returns list of all skells. |

### 🔴 Get list of tyrants

```http
  GET /api/tyrants?name={tyrant-name}
```
| Parameter | Type      | Description                |
| :-------- | :-------  | :------------------------- |
| `tyrant-name`      | `String` | **Optional**. Specifies the name of a tyrant in kebab-case. If unspecified, returns list of all tyrants. |
